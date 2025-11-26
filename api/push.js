import { put } from "@vercel/blob";

export default async function handler(req, res) {
  const timestamp = Date.now();

  const logData = {
    method: req.method,
    query: req.query,
    headers: req.headers,
    timestamp
  };

  const logText = JSON.stringify(logData, null, 2);

  // Nome único do arquivo
  const blobName = `logs/${timestamp}.txt`;

  // Salva no Blob
  const { url } = await put(blobName, logText, {
    access: "public", // se quiser acessar depois
  });

  return res.status(200).json({
    ok: true,
    saved_to: url
  });
}
