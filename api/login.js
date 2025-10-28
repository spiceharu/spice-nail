// /api/login.js
export const config = { runtime: "nodejs" };

const COOKIE_NAME = "admin_session";

function setCookie(res, value) {
  const maxAge = 60 * 60 * 8; // 8h
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: "missing password" });

  if (password === process.env.ADMIN_PASSWORD) {
    setCookie(res, "ok");
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ error: "invalid" });
}
