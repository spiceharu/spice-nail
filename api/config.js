// /api/config.js
export const config = { runtime: 'nodejs' }; // ← これが正解（'nodejs18.x' ではなく 'nodejs'）

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
    // ない場合はデフォルトで /images/hero-desktop.png を返す
    const current = (await readConfigFromBlob()) ?? { heroUrl: '/images/hero-desktop.png' };
    return res.status(200).json(current);
  }

  if (req.method === 'POST') {
    // 管理画面から { heroUrl: "..." } が来る想定
    // フィールド名が違う場合でも heroUrl を最終的に作る
    let body = req.body || {};
    // Vercel の Node.js Functions は JSON なら自動で req.body に入ります
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
