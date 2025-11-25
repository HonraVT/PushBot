import fs from "fs";
import path from "path";

// Arquivo onde os pushes recebidos serão armazenados
const LOG_FILE = path.join(process.cwd(), "push.log");

// Subscription simulada (esta subscription será passada ao servidor que envia notificações)
export const subscription = {
    endpoint: "https://seu-endpoint-de-push-aqui",
    keys: {
        p256dh: "chave_p256dh_aqui",
        auth: "chave_auth_aqui"
    }
};

// Cria arquivo se não existir
if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, "");
}

export default async function handler(req, res) {
    const url = req.url;

    // -------------------------------------------------------------------
    // 1️ Endpoint que RECEBE PUSH (Vercel funcionará como "cliente")
    // -------------------------------------------------------------------
    if (url.startsWith("/api/push-client/_push")) {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const logEntry = `[${new Date().toISOString()}] ${body}\n`;

            fs.appendFileSync(LOG_FILE, logEntry);

            return res.status(201).json({ received: true });
        });
        return;
    }

    // -------------------------------------------------------------------
    // 2️ Endpoint que retorna todos os logs JSON
    // -------------------------------------------------------------------
    if (url.startsWith("/api/push-client/pushes")) {
        const data = fs.readFileSync(LOG_FILE, "utf8")
            .split("\n")
            .filter(x => x.trim() !== "")
            .map(line => {
                const match = line.match(/^\[(.*)\] (.*)$/);
                return {
                    timestamp: match ? match[1] : null,
                    body: match ? match[2] : line
                };
            });

        return res.status(200).json({ pushes: data });
    }

    // -------------------------------------------------------------------
    // 3️ Endpoint para obter subscription
    // -------------------------------------------------------------------
    if (url.startsWith("/api/push-client/subscription")) {
        return res.status(200).json(subscription);
    }

    // Default
    res.status(404).json({ error: "Not found" });
}
