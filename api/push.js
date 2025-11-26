import { get, set } from "@vercel/edge-config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const body =
    typeof req.body === "string"
      ? req.body
      : JSON.stringify(req.body || "");

  // pega os logs existentes
  const oldLogs = (await get("push_logs")) || [];

  // adiciona um novo log
  const newLogs = [
    ...oldLogs,
    {
      timestamp: new Date().toISOString(),
      body
    }
  ];

  // salva no edge config
  await set("push_logs", newLogs);

  return res.status(201).json({ saved: true });
}
