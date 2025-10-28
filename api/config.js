// /api/config.js
export const config = { runtime: 'nodejs18.x' }; // ← Edge → Node.js に変更！

import { put, list } from '@vercel/blob';

const CONFIG_KEY = 'config/site.json';

async function readConfigFromBlob() {
  const blobs = await list({ prefix: CONFIG_KEY });
  const found = blobs.blobs.find((b) => b.pathname === CONFIG_KEY);
  if (!found) return null;

  const res = await fetch(found.url, { cache: 'no-store' });
  if (!res.ok) return null;
  return await res.json();
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const current = (await readConfigFromBlob()) ?? { heroUrl: '/images/hero-desktop.png' };
    return res.status(200).json(current);
  }

  if (req.method === 'POST') {
    const body = req.body;
    const toSave = {
      heroUrl: body.heroUrl || '/images/hero-desktop.png',
    };

    await put(CONFIG_KEY, JSON.stringify(toSave), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    return res.status(200).json({ ok: true });
  }

  return res.status(405).send('Method Not Allowed');
}
