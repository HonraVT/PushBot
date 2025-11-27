// api/debug_logs.js

export const config = {
  api: {
    bodyParser: false, // important: receive raw body
  },
};

export default async function handler(req, res) {
  console.log("---- NEW REQUEST ----");
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  // Log headers
  console.log("Headers:", req.headers);

  // Capture raw body
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks);

  console.log("Raw Body Length:", rawBody.length);
  console.log("Raw Body (hex):", rawBody.toString("hex").substring(0, 2000));
  console.log("Raw Body (base64):", rawBody.toString("base64").substring(0, 2000));

  // Try JSON parse (if applicable)
  try {
    const asText = rawBody.toString();
    console.log("Body as text:", asText.substring(0, 2000));

    try {
      console.log("Body parsed JSON:", JSON.parse(asText));
    } catch (_) {
      console.log("Body is not valid JSON.");
    }
  } catch (_) {}

  return res.status(200).json({
    ok: true,
    message: "Logged to Vercel console",
    size: rawBody.length,
  });
}
