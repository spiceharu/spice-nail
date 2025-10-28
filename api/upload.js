// /api/upload.js
export const config = { runtime: 'nodejs18.x' }; // ← Edge → Node.js に変更！

import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const file = req.files?.file;
  if (!file) {
    return res.status(400).json({ error: 'file not found' });
  }

  const key = `images/${Date.now()}-${file.originalFilename}`;
  const { url } = await put(key, file.filepath ? Buffer.from(file.filepath) : file, {
    access: 'public',
    contentType: file.mimetype || 'image/jpeg',
  });

  return res.status(200).json({ url });
}
