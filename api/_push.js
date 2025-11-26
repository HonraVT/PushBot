// api/_push.js
// Simple POST receiver — appends to in-memory array (global) per instance.
// Uses CommonJS exports for broad compatibility.

if (!global.__pushes) global.__pushes = [];

module.exports = function (req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "method not allowed" }));
    return;
  }

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    try {
      global.__pushes.push({
        timestamp: new Date().toISOString(),
        body: body || ""
      });
    } catch (e) {
      console.error("push store error:", e);
    }

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ received: true }));
  });

  req.on("error", (err) => {
    console.error("request error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "request_error" }));
  });
};
