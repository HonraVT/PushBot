// api/pushes.js
import Redis from "ioredis";

let redis;

function getRedisClient() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL); // ou host/port/password
  }
  return redis;
}

export default async function handler(req, res) {
  try {
    const client = getRedisClient();
    const items = await client.lrange("push_logs", 0, -1);

    const logs = items.map(i => {
      try {
        return JSON.parse(i);
      } catch {
        return { raw: i }; // mantém o conteúdo se não for JSON
      }
    });

    res.status(200).json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
}

