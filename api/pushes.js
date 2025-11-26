import { get } from "@vercel/edge-config";

export async function GET() {
  const logs = (await get("push_logs")) || [];

  return new Response(JSON.stringify({ logs }), {
    headers: { "Content-Type": "application/json" }
  });
}
