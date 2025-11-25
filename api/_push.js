// api/_push.js
import fs from "node:fs";

const LOG_FILE = "/tmp/push.log";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    try {
      fs.appendFileSync(
        LOG_FILE,
        `[${new Date().toISOString()}] ${body}\n`
      );
    } catch (err) {
      console.error("Erro ao salvar log:", err);
    }

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 201;
    res.end(JSON.stringify({ received: true }));
  });
}
