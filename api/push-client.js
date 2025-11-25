import fs from "fs";
import path from "path";

const LOG_FILE = "/tmp/push.log";

export default async function handler(req, res) {
    const { pathname } = new URL(req.url, "http://localhost");

    // ------------------------------------------------------------------
    // Inicia arquivo /tmp/push.log se não existir
    // ------------------------------------------------------------------
    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, "");
    }

    // ------------------------------------------------------------------
    // 👉 1. Endpoint que RECEBE PUSH
    //     URL:  POST /api/push-client/_push
    // ------------------------------------------------------------------
    if (pathname.endsWith("/_push")) {
        try {
            const body = await readBody(req);
            const entry = `[${new Date().toISOString()}] ${body}\n`;

            fs.appendFileSync(LOG_FILE, entry);

            return res.status(201).json({ received: true });
        } catch (err) {
            return res.status(500).json({ error: "Fail to write log" });
        }
    }

    // ------------------------------------------------------------------
    // 👉 2. Endpoint que retorna JSON com os pushes registrados
    //     URL: GET /api/push-client/pushes
    // ------------------------------------------------------------------
    if (pathname.endsWith("/pushes")) {
        const content = fs.readFileSync(LOG_FILE, "utf8")
            .split("\n")
            .filter(x => x.trim());

        const items = content.map(line => {
            const match = line.match(/^\[(.*?)\] (.*)$/);
            return {
                timestamp: match ? match[1] : null,
                body: match ? match[2] : line
            };
        });

        return res.status(200).json({ pushes: items });
    }

    // ------------------------------------------------------------------
    // 👉 3. Subscription estática para enviar notificações
    //     URL: GET /api/push-client/subscription
    // ------------------------------------------------------------------
    if (pathname.endsWith("/subscription")) {
        return res.status(200).json({
            endpoint: "https://example.pushservice.com/send/123",
            keys: {
                p256dh: "key",
                auth: "authkey"
            }
        });
    }

    return res.status(404).json({ error: "Not found" });
}


// --------------------------------------------------------
// Função auxiliar: lê o corpo da requisição
// --------------------------------------------------------
function readBody(req) {
    return new Promise((resolve) => {
        let data = "";
        req.on("data", chunk => (data += chunk));
        req.on("end", () => resolve(data));
    });
}
