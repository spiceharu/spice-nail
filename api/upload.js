// api/upload.js
import { put } from '@vercel/blob';

export const config = { runtime: 'nodejs' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const form = await req.formData();
  const file = form.get('file');

  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: 'file missing' }), {
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
    headers: { 'Content-Type': 'application/json' }
  });
}
