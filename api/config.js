// /api/config.js
export const config = { runtime: 'edge' };

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

export default async function handler(req) {
  if (req.method === 'GET') {
    const current = (await readConfigFromBlob()) ?? { heroUrl: '/images/hero-desktop.png' };
    return new Response(JSON.stringify(current), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const toSave = {
      heroUrl: body.heroUrl || '/images/hero-desktop.png',
    };

    await put(CONFIG_KEY, JSON.stringify(toSave), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
