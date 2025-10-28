// /src/components/Hero.jsx
export default function Hero({ heroUrl }) {
  return (
    <section className="hero">
      <img src={heroUrl} alt="Top" className="hero-img" />
    </section>
  );
}
