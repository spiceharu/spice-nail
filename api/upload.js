// /api/upload.js
export const config = { runtime: "nodejs" };

import fs from "node:fs";
import formidable from "formidable";
import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) return res.status(400).json({ error: String(err) });
      const file = files.file;
      if (!file) return res.status(400).json({ error: "file not found" });

      const filepath = file.filepath || file.file || file._writeStream?.path;
      const filename = file.originalFilename || file.newFilename || "upload.bin";
      const mimetype = file.mimetype || "application/octet-stream";
      const buf = await fs.promises.readFile(filepath);

      const key = `images/${Date.now()}-${filename}`;
      const { url } = await put(key, buf, { access: "public", contentType: mimetype });
      return res.status(200).json({ url });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "upload failed" });
    }
  });
}
