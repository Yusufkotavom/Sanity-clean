async function run() {
  const token = 'skS1phNr5FhQta6iBIN0Wx4obs9h7o1sZ8YqT9uPQfcAoKJV3Y94NL8hSd1X4W0z7HkRNTKXkq8ZTUMsg';
  const url = 'https://api.sanity.io/v1/hooks/projects/rtpa6pgc';
  
  const payload = {
    name: "Vercel Revalidate",
    dataset: "production",
    url: "https://dev.kotacom.id/api/revalidate",
    headers: {
      "x-revalidate-secret": "b8e6e5a1-b262-45ae-8276-bc7920df8bc2"
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    
    const data = await res.json();
    console.log("Success:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error creating webhook:", err.message);
  }
}

run();
