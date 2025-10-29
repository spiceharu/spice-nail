// api/pw-check.js
export const config = { runtime: 'nodejs' };

export default async function handler(req) {
  const pass = process.env.ADMIN_PASSWORD || '';

  if (req.method === 'POST') {
    const { pw } = await req.json();
    const ok = String(pw || '') === pass;
    return new Response(JSON.stringify({ ok }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (req.method === 'GET') {
    // 動作確認用
    return new Response(JSON.stringify({ ok: !!pass, len: pass.length }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
