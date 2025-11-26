// api/clear-logs.js
import Redis from "ioredis";

let redis;

function getRedisClient() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL);
  }
  return redis;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = getRedisClient();

    // Se você estiver usando lista "push_logs"
    await client.del("push_logs");

    // Se você estiver usando chaves individuais "log:*"
    // const keys = await client.keys("log:*");
    // if (keys.length) await client.del(keys);

    res.status(200).json({ ok: true, message: "Logs cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
