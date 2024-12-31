import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { userId, apiKey } = req.method === "POST" ? req.body : req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required." });
  }

  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return res.status(401).json({ success: false, message: "Invalid API Key." });
  }

  const filePath = path.join(process.cwd(), "licenses.json");
  const license = `LICENSE-${userId}-${Date.now()}`;

  let licenses = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf-8");
    licenses = JSON.parse(fileData);
  }

  licenses.push({ userId, license, createdAt: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(licenses, null, 2));

  return res.status(200).json({
    success: true,
    message: "License generated successfully!",
    license,
  });
}
