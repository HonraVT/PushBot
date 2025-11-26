import Redis from "ioredis";

export default async function handler(req, res) {
  try {
    const redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      tls: {} // obrigatório para RedisLabs na Vercel
    });

    const body = await req.text();
    const key = `log:${Date.now()}`;

    await redis.set(key, body);

    await redis.quit();

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}


