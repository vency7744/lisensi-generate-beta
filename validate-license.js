import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { license } = req.query;

  if (!license) {
    return res.status(400).json({ success: false, message: "License is required." });
  }

  const filePath = path.join(process.cwd(), "licenses.json");

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "No licenses found." });
  }

  const licenses = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const licenseData = licenses.find((item) => item.license === license);

  if (!licenseData) {
    return res.status(404).json({ success: false, message: "License not found." });
  }

  return res.status(200).json({
    success: true,
    message: "License is valid.",
    data: licenseData,
  });
}
