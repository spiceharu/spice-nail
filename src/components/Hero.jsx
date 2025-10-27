export default function Hero() {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet="/images/hero-desktop.jpg" />
      <img
        src="/images/hero-mobile.jpg"
        alt="hero"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </picture>
  );
}
