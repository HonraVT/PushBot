import Redis from "ioredis";

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: "default",
  password: process.env.REDIS_PASSWORD,
  tls: {} // obrigatório na Vercel Redis
});

export default async function handler(req, res) {
  const body = await readBody(req);

  await client.lpush(
    "pushbot_logs",
    JSON.stringify({ at: Date.now(), body })
  );

  res.status(200).json({ ok: true });
}

function readBody(req) {
  return new Promise(resolve => {
    let data = "";
    req.on("data", chunk => (data += chunk));
    req.on("end", () => resolve(data));
  });
}

