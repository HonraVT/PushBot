import Redis from "ioredis";

let redis;

function getRedisClient() {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD || undefined,
    });
  }
  return redis;
}

export default async function handler(req, res) {
  try {
    const client = getRedisClient();
    const items = await client.lrange("push_logs", 0, -1);
    const logs = items.map(i => JSON.parse(i));
    res.status(200).json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
}
