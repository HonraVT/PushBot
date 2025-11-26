// api/pushes.js
if (!global.__pushes) global.__pushes = [];

module.exports = function (req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "method not allowed" }));
    return;
  }

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify({ pushes: global.__pushes }));
};
