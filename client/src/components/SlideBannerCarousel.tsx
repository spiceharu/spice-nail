import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string | number;
  imageUrl: string;
  alt: string;
}

interface SlideBannerCarouselProps {
  banners: Banner[];
  autoPlayInterval?: number;
}

export default function SlideBannerCarousel({
  banners,
  autoPlayInterval = 3000,
}: SlideBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // バナーが1つ以下の場合は表示しない
  if (!banners || banners.length === 0) {
    return null;
  }

  // 自動スクロール
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isAutoPlay, banners.length, autoPlayInterval]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // 表示するバナーのインデックスを計算（前・現在・次）
  const prevIndex =
    currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
  const nextIndex = (currentIndex + 1) % banners.length;

  return (
    <section className="w-full bg-white py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative">
          {/* メインコンテナ */}
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {/* 左矢印 */}
            <button
              onClick={handlePrev}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              aria-label="前へ"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* スライドコンテナ */}
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-2 md:gap-4 transition-transform duration-500 ease-out">
                {/* 左側の画像（少し見える） */}
                <div className="flex-shrink-0 w-1/4 md:w-1/5 opacity-50 scale-95">
                  <img
                    src={banners[prevIndex]?.imageUrl}
                    alt={banners[prevIndex]?.alt}
                    className="w-full h-auto rounded-lg object-cover aspect-video"
                  />
                </div>

                {/* メイン画像 */}
                <div className="flex-shrink-0 w-1/2 md:w-3/5">
                  <img
                    src={banners[currentIndex]?.imageUrl}
                    alt={banners[currentIndex]?.alt}
                    className="w-full h-auto rounded-lg object-cover aspect-video"
                  />
                </div>

                {/* 右側の画像（少し見える） */}
                <div className="flex-shrink-0 w-1/4 md:w-1/5 opacity-50 scale-95">
                  <img
                    src={banners[nextIndex]?.imageUrl}
                    alt={banners[nextIndex]?.alt}
                    className="w-full h-auto rounded-lg object-cover aspect-video"
                  />
                </div>
              </div>
            </div>

            {/* 右矢印 */}
            <button
              onClick={handleNext}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              aria-label="次へ"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* インジケーター */}
          <div className="flex justify-center gap-2 mt-6">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlay(false);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-pink-500 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`スライド ${index + 1}`}
              />
            ))}
          </div>

          {/* マウスホバー時に自動再生を再開 */}
          <div
            className="absolute inset-0 pointer-events-none"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          />
        </div>
      </div>
    </section>
  );
}
