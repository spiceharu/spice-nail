// src/components/Hero.jsx
export default function Hero({ heroUrl }) {
  return (
    <section className="hero">
      <img
        src={heroUrl}
        alt="Top"
        className="hero-img"
        style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 12 }}
      />
    </section>
  );
}
