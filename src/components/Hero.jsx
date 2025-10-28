// /src/components/Hero.jsx
export default function Hero({ heroUrl }) {
  return (
    <section className="card">
      <img src={heroUrl} alt="Top" className="hero-img" />
    </section>
  );
}
