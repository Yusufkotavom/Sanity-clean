# AI Generator Shortcodes (aigen)

Sistem Generator Template (Sanity) pada repositori ini sekarang mendukung Injeksi Prompt AI Langsung melalui penggunaan *shortcode* `[aigen:...]`.

## Cara Kerja

Sistem ini mengeksekusi siklus *extract-resolve-replace*:
1. **Extract**: Saat "Generate Drafts" atau "Dry Run" dijalankan, program `program-runner-pane.tsx` memanggil `ai.ts` untuk memindai dokumen *draft* dan mengekstrak semua teks yang berformat `[aigen:...]`.
2. **Resolve**: Setiap *prompt* unik dikirim secara paralel ke Endpoint Next.js (`frontend/app/api/ai-generate/route.ts`).
3. **Replace**: Teks hasil kembalian dari AI langsung diinjeksi (overwrite) ke *draft* untuk menggantikan string `[aigen:...]` sebelum akhirnya disimpan (di-*mutate*) ke database Sanity.

## Syntax & Aturan

Gunakan format `[aigen:YOUR_PROMPT]` di mana saja di dalam teks (Portable Text, String SEO, Meta, Header, dll).

Anda **bisa menyisipkan Token Dataset** ke dalam *prompt* AI. Karena sistem generator memproses (me-*replace*) token `{{...}}` terlebih dahulu sebelum AI dieksekusi, AI akan menerima *prompt* dengan nilai token yang sudah spesifik.

**Contoh:**
`[aigen:Buatkan 1 kalimat hook singkat dan persuasif untuk layanan {{service}} di kota {{city}}]`
Jika row dataset berbunyi `service = Cetak Buku` dan `city = Sidoarjo`, AI akan menerima prompt murni:
*"Buatkan 1 kalimat hook singkat dan persuasif untuk layanan Cetak Buku di kota Sidoarjo"*

## Deduplication (Penghematan API)

Untuk menghemat kuota dan mempercepat proses, sistem menggunakan struktur `Set<string>`. Jika Anda memiliki 3 Block berbeda yang memuat *prompt* yang **persis sama**, API AI hanya akan ditembak 1 kali. Hasil dari tembakan itu akan di-paste di ketiga lokasi tersebut secara identik.

*Jika Anda menginginkan hasil yang berbeda-beda, ubah sedikit prompt-nya!*
Misalnya:
- `[aigen:Buatkan paragraf pembuka unik versi A...]`
- `[aigen:Buatkan paragraf pembuka unik versi B...]`

## Strict Output Enforcement (System Prompt)

API Route di `frontend/app/api/ai-generate/route.ts` dikonfigurasi dengan *System Prompt* ketat untuk memaksa *provider* AI (OpenAI / Gemini / Groq) hanya menghasilkan teks mentah tanpa *conversational filler* (seperti "Tentu, ini hasilnya..."). Ini penting agar *layout* dan SEO tidak rusak oleh sapaan basa-basi AI.

## Konfigurasi Provider AI (.env)

Edit `frontend/.env.local` untuk mengatur Provider. Skrip ini kompatibel dengan semua penyedia API berbasis format OpenAI.

```env
# Contoh Gemini (Default)
OPENAI_API_KEY="AIzaSy..."
OPENAI_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
OPENAI_MODEL="gemini-2.5-flash"

# Contoh Groq
# OPENAI_API_KEY="gsk_..."
# OPENAI_BASE_URL="https://api.groq.com/openai/v1/chat/completions"
# OPENAI_MODEL="llama-3.1-8b-instant"

# Contoh OpenAI Asli
# OPENAI_API_KEY="sk-..."
# OPENAI_BASE_URL="https://api.openai.com/v1/chat/completions"
# OPENAI_MODEL="gpt-4o-mini"
```

## QA Check Override

Catatan: Pada `studio/lib/generator/qa.ts`, fitur pengecekan *duplicate slug / lineage* akan **secara otomatis dilompati** apabila Mode Penulisan (Write Mode) disetel ke `"Overwrite Existing"`. Ini memastikan proses *update/overwrite* yang dipicu massal bisa berjalan mulus tanpa terblokir oleh aturan *Duplicate Document*.
