// /api/upload.js
export const config = { runtime: 'edge' };

import { put } from '@vercel/blob';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: 'file not found' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const key = `images/${Date.now()}-${file.name}`;

  const { url } = await put(key, file, {
    access: 'public',
    contentType: file.type || 'image/jpeg'
  });

  return new Response(JSON.stringify({ url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
