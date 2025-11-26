import Redis from "ioredis";

export default async function handler(req, res) {
  try {
    // leitura do body no Node.js da Vercel
    let body = "";
    for await (const chunk of req) body += chunk;

    const redis = new Redis(process.env.REDIS_URL, {
      tls: {} // necessário para RedisLabs
    });

    const key = `log:${Date.now()}`;

    await redis.set(key, body);

    redis.quit();

    return res.status(200).json({ ok: true, saved: key });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
