// src/components/MapEmbed.jsx
export default function MapEmbed({ src, address }) {
  if (!src) return null;
  return (
    <div className="card">
      <div className="section-title">アクセス</div>
      {address ? <div style={{ marginBottom: 8 }}>{address}</div> : null}
      <iframe
        src={src}
        style={{ width: "100%", height: 260, border: 0, borderRadius: 12 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      />
    </div>
  );
}
