// api/pw-check.js
export const config = { runtime: 'nodejs' };

export default async function handler(req) {
  const pass = process.env.ADMIN_PASSWORD || '5793';

  if (req.method === 'POST') {
    const { pw } = await req.json();
    const ok = String(pw || '') === String(pass);
    return new Response(JSON.stringify({ ok }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
