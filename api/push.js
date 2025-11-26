import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD || undefined
});

client.connect();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

  await client.lPush("push_logs", JSON.stringify({
    timestamp: new Date().toISOString(),
    body
  }));

  res.status(201).json({ received: true });
}

