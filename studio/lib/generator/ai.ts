export const extractAiPrompts = (obj: any): string[] => {
  const prompts = new Set<string>();
  const regex = /\[aigen:([\s\S]*?)\]/g;

  const traverse = (node: any) => {
    if (typeof node === "string") {
      let match;
      while ((match = regex.exec(node)) !== null) {
        prompts.add(match[1]);
      }
    } else if (Array.isArray(node)) {
      node.forEach(traverse);
    } else if (node !== null && typeof node === "object") {
      Object.values(node).forEach(traverse);
    }
  };

  traverse(obj);
  return Array.from(prompts);
};

export const replaceAiPrompts = (obj: any, replacements: Record<string, string>): any => {
  const regex = /\[aigen:([\s\S]*?)\]/g;

  const processNode = (node: any): any => {
    if (typeof node === "string") {
      return node.replace(regex, (match, prompt) => {
        return replacements[prompt] || match;
      });
    } else if (Array.isArray(node)) {
      return node.map(processNode);
    } else if (node !== null && typeof node === "object") {
      const result: any = {};
      for (const [key, value] of Object.entries(node)) {
        result[key] = processNode(value);
      }
      return result;
    }
    return node;
  };

  return processNode(obj);
};

export const resolveAiPromptsSync = (draft: any): any => {
  const prompts = extractAiPrompts(draft);
  if (prompts.length === 0) return draft;
  const replacements: Record<string, string> = {};
  for (const prompt of prompts) {
    replacements[prompt] = `(AI: ${prompt})`;
  }
  return replaceAiPrompts(draft, replacements);
};

export const resolveAiPrompts = async (
  draft: any,
  options: { mode: "dry-run" | "generate"; apiUrl?: string }
): Promise<any> => {
  const prompts = extractAiPrompts(draft);
  if (prompts.length === 0) return draft;

  const replacements: Record<string, string> = {};

  const MAX_RETRIES = 3;
  let attempt = 0;
  let success = false;

  while (attempt < MAX_RETRIES && !success) {
    try {
      const url = options.apiUrl || "http://localhost:3000/api/ai-generate";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompts }),
      });
      
      if (!res.ok) {
        if (res.status === 429 || res.status >= 500) {
          throw new Error(`AI API Error: ${res.status} ${res.statusText}`);
        }
        throw new Error(`AI Client Error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        prompts.forEach((prompt, idx) => {
          replacements[prompt] = data.results[idx] || `[AI Empty]`;
        });
        success = true;
      } else {
        throw new Error("Invalid AI API response format");
      }
    } catch (err: any) {
      attempt++;
      console.warn(`resolveAiPrompts attempt ${attempt} failed:`, err.message);
      
      if (err.message.includes("Client Error") || attempt >= MAX_RETRIES) {
        console.error("resolveAiPrompts fatal error:", err);
        for (const prompt of prompts) {
          replacements[prompt] = `[AI Failed]`;
        }
        break;
      }
      
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return replaceAiPrompts(draft, replacements);
};
