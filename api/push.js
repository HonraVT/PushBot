let memoryPushes = global.memoryPushes || [];
global.memoryPushes = memoryPushes;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = "";

  // suporta text/plain, JSON ou raw
  if (typeof req.body === "string") {
    body = req.body;
  } else if (req.body && typeof req.body === "object") {
    body = JSON.stringify(req.body);
  } else {
    body = await new Promise(resolve => {
      let data = "";
      req.on("data", chunk => (data += chunk));
      req.on("end", () => resolve(data));
    });
  }

  const entry = {
    timestamp: new Date().toISOString(),
    body
  };

  memoryPushes.push(entry);

  return res.status(201).json({ received: true });
}
