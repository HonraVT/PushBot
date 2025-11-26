import fs from "node:fs";

const LOG_FILE = "/tmp/push.log";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${body}\n`);
    res.status(201).json({ received: true });
  });
}
