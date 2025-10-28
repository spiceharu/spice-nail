// /api/logout.js
export const config = { runtime: "nodejs" };

const COOKIE_NAME = "admin_session";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Lax`);
  return res.status(200).json({ ok: true });
}
