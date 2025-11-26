import fs from "node:fs";

const LOG_FILE = "/tmp/push.log";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const body = req.body || "";

  fs.appendFileSync(
    LOG_FILE,
    `[${new Date().toISOString()}] ${body}\n`
  );

  res.status(201).json({ received: true });
}
