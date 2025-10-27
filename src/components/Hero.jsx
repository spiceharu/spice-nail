export default function Hero({site}){
  const h = site.hero ?? {};
  return (
    <section>
      {h.videoUrl ? (
        <video src={h.videoUrl} autoPlay loop muted playsInline className="heroImg"/>
      ) : (
        <>
          <img className="heroImg" src={h.desktopImage} alt="hero" media="(min-width:768px)"/>
          <img className="heroImg" src={h.mobileImage||h.desktopImage} alt="hero-mobile"/>
        </>
      )}
    </section>
  );
}
