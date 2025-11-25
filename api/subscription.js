export async function GET() {
  return new Response(
    JSON.stringify({
      endpoint: "https://example.pushservice.com/send/123",
      keys: {
        p256dh: "demo-key",
        auth: "demo-auth"
      }
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
