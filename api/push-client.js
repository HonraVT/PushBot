import fs from "fs";

const LOG_FILE = "/tmp/push.log";

function ensureLogFile() {
    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, "");
    }
}

export default async function handler(req, res) {
    ensureLogFile();

    const url = new URL(req.url, "http://localhost");
    const path = url.pathname;
    const query = url.searchParams;

    // ---------------------
    // Route: POST /api/push-client/_push
    // ---------------------
    if (path.endsWith("/_push") && req.method === "POST") {
        const body = await readBody(req);

        fs.appendFileSync(
            LOG_FILE,
            `[${new Date().toISOString()}] ${body}\n`
        );

        return res.status(201).json({ received: true });
    }

    // ---------------------
    // Route: GET /api/push-client/pushes
    // ---------------------
    if (path.endsWith("/pushes") && req.method === "GET") {
        const lines = fs
            .readFileSync(LOG_FILE, "utf-8")
            .split("\n")
            .filter(Boolean);

        const pushes = lines.map((line) => {
            const m = line.match(/^\[(.*?)\] (.*)$/);
            return {
                timestamp: m ? m[1] : null,
                body: m ? m[2] : line,
            };
        });

        return res.status(200).json({ pushes });
    }

    // ---------------------
    // Route: GET /api/push-client/subscription
    // ---------------------
    if (path.endsWith("/subscription") && req.method === "GET") {
        return res.status(200).json({
            endpoint: "https://example.pushservice.com/send/123",
            keys: {
                p256dh: "key",
                auth: "authkey",
            },
        });
    }

    // ---------------------
    // Not found
    // ---------------------
    return res.status(404).json({ error: "Not found" });
}

// Helper para ler o corpo da requisição
function readBody(req) {
    return new Promise((resolve) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data));
    });
}
