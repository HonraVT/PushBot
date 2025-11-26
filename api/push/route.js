import fs from "node:fs";

export const config = {
  runtime: "nodejs" // garante acesso ao filesystem
};

const LOG_FILE = "/tmp/push.log";

export async function POST(request) {
  const body = await request.text();

  fs.appendFileSync(
    LOG_FILE,
    `[${new Date().toISOString()}] ${body}\n`
  );

  return new Response(
    JSON.stringify({ received: true }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}
