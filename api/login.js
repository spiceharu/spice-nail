export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const body = await req.json().catch(() => ({}));
  const input = (body.password ?? '').toString();
  const saved = (process.env.ADMIN_PASSWORD || '').toString();
  const ok = input === saved;
  return new Response(JSON.stringify({ ok }), {
    headers: { 'content-type': 'application/json' }
  });
}
