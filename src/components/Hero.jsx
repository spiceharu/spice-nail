import Hero from "../components/Hero";

export default function Home() {
  const heroUrl = "/images/hero-desktop.png"; // ← ここで画像のパスを指定！

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Hero heroUrl={heroUrl} />

      <h1>Spice Nail へようこそ！</h1>
      <p>このページが表示されていればデプロイ成功です！</p>
    </div>
  );
}
