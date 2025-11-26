export const config = {
  runtime: "nodejs"
};

import fs from "node:fs";

const LOG_FILE = "/tmp/push.log";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "method not allowed" });
  }

  if (!fs.existsSync(LOG_FILE)) {
    return res.status(200).json({ pushes: [] });
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

  res.status(200).json({ pushes });
}
