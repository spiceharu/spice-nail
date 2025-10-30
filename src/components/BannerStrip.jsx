// src/components/BannerStrip.jsx
export default function BannerStrip({ banners = [] }) {
  if (!banners.length) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        overflowX: "auto",
        marginBottom: 16
      }}
    >
      {banners.map((b, i) => (
        <img
          key={i}
          src={b}
          alt={`banner-${i}`}
          style={{ height: 110, borderRadius: 12 }}
        />
      ))}
    </div>
  );
}
