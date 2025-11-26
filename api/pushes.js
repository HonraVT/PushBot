import { createClient } from "redis";

let client;

async function getClient() {
  if (!client) {
    client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });
    await client.connect();
  }
  return client;
}

export default async function handler(req, res) {
  const client = await getClient();
  const items = await client.lRange("push_logs", 0, -1);
  const logs = items.map(i => JSON.parse(i));

  res.status(200).json({ logs });
}

