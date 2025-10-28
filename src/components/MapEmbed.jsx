// /src/components/MapEmbed.jsx
export default function MapEmbed({ site }) {
  const m = site.map ?? {};
  if (!m.embedSrc) return null;

  return (
    <section className="card">
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        {m.placeName || "アクセス（Googleマップ）"}
      </div>
      {m.address ? (
        <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 8 }}>
          {m.address}
        </div>
      ) : null}
      <iframe
        title="map"
        src={m.embedSrc}
        width="100%"
        height="260"
        loading="lazy"
        style={{ border: 0, borderRadius: 12 }}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}
