import Hero from "../components/Hero";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <Hero heroUrl="/images/hero-desktop.png" />
      <h1>Spice Nail へようこそ！</h1>
      <p>このページが表示されていればデプロイ成功です！</p>
    </div>
  );
}
