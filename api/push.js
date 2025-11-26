import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS
});

export default async function handler(req, res) {
  const body =
    req.method === "POST"
      ? JSON.stringify(req.body)
      : JSON.stringify(req.query);

  try {
    await redis.lpush("push_logs", body);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

