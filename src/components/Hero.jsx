// src/components/Hero.jsx
export default function Hero({ pcImage, spImage }) {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;
  const src = isMobile ? (spImage || pcImage) : pcImage;

  return (
    <section style={{ marginBottom: 16, borderRadius: 16, overflow: "hidden" }}>
      {src ? (
        <img
          src={src}
          alt="Top"
          className="hero-img"
          style={{ height: 320 }}
        />
      ) : (
        <div
          style={{
            height: 160,
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          トップ画像を設定してください
        </div>
      )}
    </section>
  );
}
