// src/pages/Home.jsx
import Hero from "../components/Hero";

// ✅ Viteのimportでpublic配下の画像を解決（これが一番安定）
import heroDesktop from "/images/hero-desktop.png";

export default function Home() {
  const heroUrl = heroDesktop; // ← 文字列ではなく import した値を渡す

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Hero heroUrl={heroUrl} />

      <h1>Spice Nail へようこそ！</h1>
      <p>このページが表示されていればデプロイ成功です！</p>
    </div>
  );
}
