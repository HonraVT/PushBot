export default async function handler(req, res) {
  try {
    const client = getRedisClient();
    const items = await client.lrange("push_logs", 0, -1);

    const logs = items.map(i => {
      try {
        return JSON.parse(i);
      } catch {
        return { raw: i }; // mantém a string se não for JSON
      }
    });

    res.status(200).json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
}

