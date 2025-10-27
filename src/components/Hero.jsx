export default function Hero({ heroUrl }) {
  return (
    <section className="hero-wrap">
      <img src={heroUrl} alt="Top" className="hero-img" />
    </section>
  );
}
