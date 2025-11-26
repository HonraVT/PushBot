import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD || undefined
});

client.connect();

export default async function handler(req, res) {
  const items = await client.lRange("push_logs", 0, -1);
  const logs = items.map(i => JSON.parse(i));

  res.status(200).json({ logs });
}
