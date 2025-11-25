const fs = require("fs");

const LOG_FILE = "/tmp/push.log";

function ensureLogFile() {
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, "");
  }
}

function readBody(req) {
  return new Promise(resolve => {
    let data = "";
    req.on("data", chunk => (data += chunk));
    req.on("end", () => resolve(data));
  });
}

module.exports = async function handler(req, res) {
  ensureLogFile();

  const url = new URL(req.url, "http://localhost");
  const pathname = url.pathname;

  // POST /api/push-client/_push
  if (pathname.endsWith("/_push") && req.method === "POST") {
    const body = await readBody(req);
    fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${body}\n`);
    return res.status(201).json({ received: true });
  }

  // GET /api/push-client/pushes
  if (pathname.endsWith("/pushes") && req.method === "GET") {
    const content = fs.readFileSync(LOG_FILE, "utf8");
    const pushes = content
      .split("\n")
      .filter(Boolean)
      .map(line => {
        const match = line.match(/^\[(.*?)\] (.*)$/);
        return {
          timestamp: match?.[1] || "",
          body: match?.[2] || line
        };
      });

    return res.status(200).json({ pushes });
  }

  // GET /api/push-client/subscription
  if (pathname.endsWith("/subscription") && req.method === "GET") {
    return res.status(200).json({
      endpoint: "https://example.pushservice.com/send/123",
      keys: {
        p256dh: "demo-key",
        auth: "demo-auth"
      }
    });
  }

  return res.status(404).json({ error: "not_found" });
};
