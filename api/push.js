import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const body =
    typeof req.body === "string"
      ? req.body
      : JSON.stringify(req.body || "");

  await kv.lpush("push_logs", {
    timestamp: new Date().toISOString(),
    body
  });

  return res.status(201).json({ received: true });
}
