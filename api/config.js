// api/config.js
import { list, put } from '@vercel/blob';

export const config = { runtime: 'nodejs' };

const KEY = 'config/site.json';

async function readConfig() {
  // config/ 以下の一覧を取る
  const blobs = await list({ prefix: 'config/' });
  const found = blobs.blobs.find(b => b.pathname === KEY);
  if (!found) return null;

  const res = await fetch(found.url, { cache: 'no-store' });
  if (!res.ok) return null;
  return await res.json();
}

export default async function handler(req) {
  if (req.method === 'GET') {
    // なかったらデフォルト返す
    const cur = (await readConfig()) ?? {
      hero: { pc: '', sp: '' },
      background: { pc: '', sp: '' },
      banners: [],
      socials: [],
      map: { embedSrc: '', address: '' }
    };
    return new Response(JSON.stringify(cur), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  }

  if (req.method === 'POST') {
    const body = await req.json();
    // そのまま保存
    await put(KEY, JSON.stringify(body), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
