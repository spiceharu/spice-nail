// src/pages/Home.jsx
import Hero from "../components/Hero";
import heroDesktop from "/images/hero-desktop.png"; // ← ここで画像を読み込む

export default function Home() {
  const heroUrl = heroDesktop; // 読み込んだ画像をHeroに渡す

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* Heroコンポーネントを呼び出し */}
      <Hero heroUrl={heroUrl} />

      <h1>Spice Nail へようこそ！</h1>
      <p>このページが表示されていればデプロイ成功です！</p>
    </div>
  );
}
