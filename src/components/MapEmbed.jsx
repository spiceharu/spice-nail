export default function MapEmbed({ site }) {
  const m = site.map ?? {};
  if (!m.embedSrc) return null;
  return (
    <div className="card">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        アクセス（Googleマップ）
      </div>
      <iframe
        title="map"
        src={m.embedSrc}
        width="100%"
        height="260"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0, borderRadius: 12 }}
      />
    </div>
  );
}
