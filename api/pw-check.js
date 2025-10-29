export const config = { runtime: 'edge' };

export default async function handler() {
  const pw = (process.env.ADMIN_PASSWORD || '').trim();
  return new Response(
    JSON.stringify({ ok: pw.length > 0, len: pw.length }),
    { headers: { 'content-type': 'application/json' } }
  );
}
