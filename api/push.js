import Redis from "ioredis";

export default async function handler(req, res) {
  try {
    let body = "";
    for await (const chunk of req) body += chunk;

    const redis = new Redis(process.env.REDIS_URL); // ou host/port/password

    // Adiciona o log no topo da lista "push_logs"
    await redis.lpush("push_logs", body);

    redis.quit();

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
