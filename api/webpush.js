import Redis from "ioredis";
import { Buffer } from "node:buffer";
import * as webpush from "web-push";

export default async function handler(req, res) {
  try {
    const redis = new Redis(process.env.REDIS_URL);

    // --- Read raw body (binary octet-stream) ---
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const bodyBuffer = Buffer.concat(chunks);

    // --- Extract VAPID header ---
    const auth = req.headers["authorization"] || "";
    const match = auth.match(/vapid t=([^,]+), k=(.+)$/);

    const vapidToken = match?.[1];
    const remotePublicKey = match?.[2];

    // Log raw entry
    const logEntry = {
      timestamp: Date.now(),
      vapidToken,
      remotePublicKey,
      raw: bodyBuffer.toString("base64")
    };

    // Try decrypting
    let decrypted = null;

    try {
      decrypted = await webpush.decrypt(
        bodyBuffer,
        {
          endpoint: "https://dummy", // required
          keys: {
            p256dh: process.env.VAPID_PUBLIC_KEY,
            auth: "dummy"
          }
        },
        {
          privateKey: process.env.VAPID_PRIVATE_KEY
        }
      );

      logEntry.decrypted = decrypted.plaintext.toString();
    } catch (e) {
      logEntry.decryptedError = e.message;
    }

    // Save to Redis
    await redis.lpush("push_logs", JSON.stringify(logEntry));
    redis.quit();

    return res.status(200).json({ ok: true, decrypted: !!decrypted });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
