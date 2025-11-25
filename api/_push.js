// api/_push.js
// Compat layer: works as Next.js route (export POST) and as classic Node req,res handler (export default).
import fs from "node:fs";

const LOG_FILE = "/tmp/push.log";

function ensureLogFile() {
  try {
    if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, "");
  } catch (e) {
    // ignore
  }
}

function appendLog(text) {
  ensureLogFile();
  try {
    fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${text}\n`);
  } catch (e) {
    // best-effort
  }
}

/* ------------------------------
   1) Next.js / Vercel modern: export POST(request)
   ------------------------------ */
export async function POST(request) {
  try {
    const text = await request.text();
    appendLog(text);
    return new Response(JSON.stringify({ received: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

/* ------------------------------
   2) Fallback for older/other handlers: export default (req,res)
   Some Vercel configurations still map to Node-style handlers.
   ------------------------------ */
export default async function handler(req, res) {
  // only handle POST here
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  // read body (works for chunked too)
  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    appendLog(body || "");
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ received: true }));
  });

  req.on("error", (err) => {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: String(err) }));
  });
}

