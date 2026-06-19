// ============================================================
// AI Provider Orchestrator — Multi-Key + Multi-Provider Fallback
// ============================================================
//
// ENV variables:
//   Primary provider (OpenAI-compatible):
//     OPENAI_API_KEYS="key1,key2,key3"   (multi-key, overrides OPENAI_API_KEY)
//     OPENAI_API_KEY="key1"              (backward compat single key)
//     OPENAI_BASE_URL="https://..."
//     OPENAI_MODEL="gpt-4o-mini"
//
//   Fallback provider chain (tried in order when primary exhausted):
//     AI_FALLBACK_PROVIDERS="groq,openrouter"
//     GROQ_API_KEY="gsk_..."
//     GROQ_BASE_URL="https://api.groq.com/openai/v1/chat/completions"
//     GROQ_MODEL="llama-3.1-8b-instant"
//     OPENROUTER_API_KEY="sk-or-..."
//     OPENROUTER_BASE_URL="https://openrouter.ai/api/v1/chat/completions"
//     OPENROUTER_MODEL="google/gemini-2.5-flash:free"
//
//   Tuning:
//     AI_KEY_COOLDOWN_MS=60000   (cooldown duration after 429, default 60s)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProviderConfig {
  name: string;
  keys: string[];
  baseUrl: string;
  model: string;
}

// ---------------------------------------------------------------------------
// KeyManager — round-robin + rate-limit cooldown
// ---------------------------------------------------------------------------

class KeyManager {
  private keys: string[];
  private index = 0;
  private cooldowns = new Map<string, number>();
  private readonly cooldownMs: number;

  constructor(keys: string[], cooldownMs?: number) {
    this.keys = keys;
    this.cooldownMs = cooldownMs ?? (Number(process.env.AI_KEY_COOLDOWN_MS) || 60_000);
  }

  /** Returns the next available key, or null if all keys are on cooldown. */
  next(): string | null {
    if (this.keys.length === 0) return null;

    const now = Date.now();
    const start = this.index;

    do {
      const key = this.keys[this.index % this.keys.length];
      this.index = (this.index + 1) % this.keys.length;

      const until = this.cooldowns.get(key);
      if (!until || now >= until) return key;
    } while (this.index % this.keys.length !== start % this.keys.length);

    return null; // every key is on cooldown
  }

  /** Mark a key as rate-limited so it won't be returned for `cooldownMs`. */
  cooldown(key: string) {
    this.cooldowns.set(key, Date.now() + this.cooldownMs);
  }

  /** Reset cooldown — call on success so aggressive rate-limiting cools faster. */
  resetCooldown(key: string) {
    this.cooldowns.delete(key);
  }

  get availableCount(): number {
    const now = Date.now();
    return this.keys.filter(k => {
      const until = this.cooldowns.get(k);
      return !until || now >= until;
    }).length;
  }
}

// ---------------------------------------------------------------------------
// Config loader
// ---------------------------------------------------------------------------

function loadConfig(): { primary: ProviderConfig; fallbacks: ProviderConfig[] } {
  // --- Primary ---
  const keysStr = process.env.OPENAI_API_KEYS || process.env.OPENAI_API_KEY || '';
  const primaryKeys = keysStr.split(',').map(k => k.trim()).filter(Boolean);

  const primary: ProviderConfig = {
    name: 'primary',
    keys: primaryKeys,
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  };

  // --- Fallbacks ---
  const fallbackPrefixes = (process.env.AI_FALLBACK_PROVIDERS || '')
    .split(',')
    .map(s => s.trim().toUpperCase())
    .filter(Boolean);

  const fallbacks: ProviderConfig[] = fallbackPrefixes
    .map(prefix => ({
      name: prefix.toLowerCase(),
      keys: [(process.env[`${prefix}_API_KEY`] || '')].filter(Boolean),
      baseUrl: process.env[`${prefix}_BASE_URL`] || '',
      model: process.env[`${prefix}_MODEL`] || '',
    }))
    .filter(p => p.keys.length > 0 && p.baseUrl && p.model);

  return { primary, fallbacks };
}

// ---------------------------------------------------------------------------
// System prompt — strict output enforcement
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = [
  'You are an automated content generator.',
  'Output ONLY the EXACT requested content.',
  'Do NOT include any conversational filler, intro, outro, or multiple options.',
  'Do not say "Here is the result" or "Tentu, ini beberapa pilihan".',
  'Be extremely direct and to the point.',
  'If asked for 1 sentence, output exactly 1 sentence.',
].join(' ');

// ---------------------------------------------------------------------------
// Single provider call
// Returns: response text | null (rate-limited) | error string
// ---------------------------------------------------------------------------

async function callProvider(
  prompt: string,
  config: ProviderConfig,
  key: string,
  signal?: AbortSignal,
): Promise<string | null> {
  try {
    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
      signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');

      if (response.status === 429) {
        console.warn(`[${config.name}] Rate-limited (key: …${key.slice(-6)})`);
        return null; // signal: retry with next key
      }

      // Temporary server error — worth a retry
      if (response.status >= 500 && response.status < 600) {
        console.warn(`[${config.name}] Server error ${response.status} (key: …${key.slice(-6)})`);
        return null;
      }

      console.error(`[${config.name}] API error ${response.status}: ${body.slice(0, 200)}`);
      return `[AI Error: ${response.statusText}]`;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    return text || '[Empty Output]';
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return null; // timeout, retry
    }
    console.error(`[${config.name}] Fetch error:`, err.message);
    return '[AI Error: Network/Parse]';
  }
}

// ---------------------------------------------------------------------------
// Resolve a single prompt across the provider chain
// ---------------------------------------------------------------------------

async function resolvePrompt(
  prompt: string,
  keyManager: KeyManager,
  primary: ProviderConfig,
  fallbacks: ProviderConfig[],
  signal?: AbortSignal,
): Promise<string> {
  // ---- Primary provider: try each key (round-robin + cooldown) ----
  for (let attempt = 0; attempt < Math.max(primary.keys.length, 1); attempt++) {
    const key = keyManager.next();
    if (!key) break; // all keys on cooldown

    const result = await callProvider(prompt, primary, key, signal);
    if (result === null) {
      // Rate-limited or server error — cooldown this key, try next
      keyManager.cooldown(key);
      continue;
    }
    // Success or permanent error — reset cooldown and return
    keyManager.resetCooldown(key);
    return result;
  }

  // ---- Fallback providers: try each in order ----
  for (const fb of fallbacks) {
    console.log(`[AI] Falling back to ${fb.name}...`);
    const result = await callProvider(prompt, fb, fb.keys[0], signal);
    if (result !== null && !result.startsWith('[AI Error')) {
      return result;
    }
    // If fallback also fails, try next fallback
    console.warn(`[AI] ${fb.name} failed, trying next fallback...`);
  }

  return '[AI Failed: All providers exhausted]';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface GenerateOptions {
  /** Optional AbortSignal for timeout/cancellation */
  signal?: AbortSignal;
}

/**
 * Generate AI content for an array of prompts.
 *
 * Architecture:
 *  1. Round-robins across primary provider's keys (cooldown on 429).
 *  2. If all primary keys exhausted, tries fallback providers in order.
 *  3. Each prompt runs independently, so one failure won't block others.
 *
 * Backward compatible: single OPENAI_API_KEY works as before.
 */
export async function generateAll(
  prompts: string[],
  options: GenerateOptions = {},
): Promise<string[]> {
  const { primary, fallbacks } = loadConfig();

  if (primary.keys.length === 0) {
    throw new Error(
      'No API key configured. Set OPENAI_API_KEY or OPENAI_API_KEYS in env.',
    );
  }

  const keyManager = new KeyManager(primary.keys);

  // Run all prompts in parallel — each uses its own key from the pool
  return Promise.all(
    prompts.map((prompt) =>
      resolvePrompt(prompt, keyManager, primary, fallbacks, options.signal),
    ),
  );
}
