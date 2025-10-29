// api/config.js
import { list, put } from '@vercel/blob';

export const config = { runtime: 'nodejs' };

const KEY = 'config/site.json';

async function readConfigFromBlob() {
  const blobs = await list({ prefix: 'config/' });
  const found = blobs.blobs.find(b => b.pathname === KEY);
  if (!found) return null;
  const res = await fetch(found.url, { cache: 'no-store' });
  if (!res.ok) return null;
  return await res.json();
}

export default async function handler(req) {
  if (req.method === 'GET') {
    const cur = (await readConfigFromBlob()) ?? {
      hero: { desktopImage: '', mobileImage: '' },
      background: { desktopImage: '', mobileImage: '' },
      socials: { instagram: '', x: '', line: '', tiktok: '', youtube: '' },
      map: { embedSrc: '', address: '' }
    };
    return new Response(JSON.stringify(cur), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }

  if (req.method === 'POST') {
    const payload = await req.json();
    const body = JSON.stringify(payload);
    await put(KEY, body, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
