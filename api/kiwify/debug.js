// Endpoint temporário de debug — ler último payload recebido
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (!REDIS_URL || !REDIS_TOKEN) return res.status(200).json({ error: "Redis não configurado" });

  const r = await fetch(`${REDIS_URL}/get/kiwify:debug:last_payload`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  const data = await r.json();
  const raw = data.result;
  try {
    return res.status(200).json({ payload: JSON.parse(raw) });
  } catch {
    return res.status(200).json({ raw });
  }
}
