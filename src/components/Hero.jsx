// /src/components/Hero.jsx
export default function Hero({ heroUrl }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const src = isMobile ? "/images/hero-mobile.png" : heroUrl || "/images/hero-desktop.png";

  return (
    <section className="hero">
      <img
        src={src}
        alt="Top"
        className="hero-img"
        style={{
          width: "100%",
          height: isMobile ? 360 : 320,
          objectFit: "cover",
          borderRadius: 12,
        }}
      />
    </section>
  );
}
