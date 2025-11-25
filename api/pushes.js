import fs from "node:fs";

const LOG_FILE = "/tmp/push.log";

export async function GET() {
  if (!fs.existsSync(LOG_FILE)) {
    return new Response(JSON.stringify({ pushes: [] }), {
      headers: { "Content-Type": "application/json" }
    });
  }

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

  return new Response(JSON.stringify({ pushes }), {
    headers: { "Content-Type": "application/json" }
  });
}
