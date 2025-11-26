import { kv } from "@vercel/kv";

export async function GET() {
  const logs = await kv.lrange("push_logs", 0, -1);

  return new Response(
    JSON.stringify({ logs }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
}
