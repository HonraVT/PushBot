import Redis from "ioredis";

export default async function handler(req, res) {
  try {
    let body = "";
    for await (const chunk of req) body += chunk;

    const redis = new Redis(process.env.REDIS_URL);

    // Se body não for JSON, você pode transformar em objeto
    const logEntry = {
      timestamp: Date.now(),
      data: body
    };

    await redis.lpush("push_logs", JSON.stringify(logEntry));

    redis.quit();

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
