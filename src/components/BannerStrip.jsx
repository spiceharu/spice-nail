export default function BannerStrip({site}){
  const h = site.hero ?? {};
  const sp = Math.max(3, Number(h.scrollSpeed || 6));
  const imgs = (window.innerWidth>=768 ? h.bannersDesktop : h.bannersMobile) || [];
  if(!imgs.length) return null;
  return (
    <div className="bannerWrap">
      <div className="bannerTrack" style={{animationDuration:`${sp*imgs.length}s`}}>
        {[...imgs, ...imgs].map((src,i)=>(
          <img key={i} src={src} alt={`banner-${i}`}
               style={{width:"33.3333%",height:"26vw",maxHeight:320,minHeight:140,objectFit:"cover"}}/>
        ))}
      </div>
    </div>
  );
}
