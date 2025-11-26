import Redis from "ioredis";
import webpush from "web-push";

const redis = new Redis(process.env.REDIS_URL);

// Substitua pelos valores da subscription que você cadastrou
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Recebe o body bruto da requisição
    const bodyBuffer = [];
    for await (const chunk of req) bodyBuffer.push(chunk);
    const body = Buffer.concat(bodyBuffer);

    // Normalmente, o payload vem como base64 ou ArrayBuffer
    // Para Web Push, ele deve conter: endpoint, keys e headers
    const pushData = JSON.parse(body.toString());

    const decrypted = webpush.decrypt({
      // O corpo recebido do push
      payload: pushData.payload,
      // Chaves da subscription
      headers: pushData.headers,
      // key e auth da subscription
      cryptoKey: pushData.key,
      authSecret: pushData.token
    });

    const logEntry = {
      timestamp: Date.now(),
      data: decrypted.toString()
    };

    await redis.lpush("push_logs", JSON.stringify(logEntry));

    res.status(200).json({ ok: true, decrypted: decrypted.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
