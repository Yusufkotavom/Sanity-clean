const fetch = require('node-fetch'); // or use built-in fetch if Node 18+

async function testGemini() {
  const apiKey = "AIzaSyB3MiUTj00pWwOhYf_0zoaH5mutmmpGBRQ";
  const baseUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  const model = "gemini-1.5-flash";
  const prompt = "Buatkan 1 kalimat promosi untuk Cetak Buku Sidoarjo.";

  try {
    const response = await globalThis.fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", text);
  } catch (e) {
    console.error("Error:", e);
  }
}

testGemini();
