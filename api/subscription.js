export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "method not allowed" });
  }

  res.json({
    endpoint: "https://example.pushservice.com/send/123",
    keys: {
      p256dh: "demo-key",
      auth: "demo-auth"
    }
  });
}
