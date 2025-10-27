// /api/config.js
export const config = { runtime: 'edge' };

import { put, list } from '@vercel/blob';

const CONFIG_KEY = 'config/site.json';

async function readConfigFromBlob() {
  // 既存の site.json を探す
  const { blobs } = await list({ prefix: CONFIG_KEY });
  const found = blobs.find(b => b.pathname === CONFIG_KEY);
  if (!found) return null;
  const res = await fetch(found.url, { cache: 'no-store' });
  if (!res.ok) return null;
  return await res.json();
}

export default async function handler(req) {
  if (req.method === 'GET') {
    const current = (await readConfigFromBlob()) ?? {
      heroUrl: '/images/hero-desktop.jpg' // 初期表示用（public/images に置く想定）
    };
    return new Response(JSON.stringify(current), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }

  if (req.method === 'POST') {
    const payload = await req.json();
    const toSave = {
      heroUrl: payload.heroUrl || '/images/hero-desktop.jpg'
    };
    await put(CONFIG_KEY, JSON.stringify(toSave), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
