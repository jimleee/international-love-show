import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 手机端：把品牌海报（原 mobile slide-6）放第一张，其余按原序排列，末尾再以海报收尾
const MOBILE_ORDER = [6, 1, 2, 3, 4, 5, 6];

const SLIDES = Array.from({ length: 7 }, (_, i) => ({
  src: `/images/carousel/slide-${i + 1}.jpg`,
  mobileSrc: `/images/carousel/mobile/slide-${MOBILE_ORDER[i]}.png`,
}));

export default function HeroCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    const id = setInterval(() => embla.scrollNext(), 5000);
    return () => {
      clearInterval(id);
      embla.off("select", onSelect);
    };
  }, [embla]);

  return (
    <section className="relative w-full overflow-hidden h-screen">
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {SLIDES.map((s, i) => (
            <div key={i} className="relative flex-[0_0_100%] h-full">
              <picture className="block w-full h-full">
                <source media="(max-width: 767px)" srcSet={s.mobileSrc} />
                <img src={s.src} alt="" className="w-full h-full object-cover" />
              </picture>
            </div>
          ))}
        </div>
      </div>

      {/* Minimal ghost arrows */}
      <button
        onClick={() => embla?.scrollPrev()}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors duration-300"
        aria-label="prev"
      >
        <ChevronLeft size={32} strokeWidth={1} />
      </button>
      <button
        onClick={() => embla?.scrollNext()}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors duration-300"
        aria-label="next"
      >
        <ChevronRight size={32} strokeWidth={1} />
      </button>

      {/* Scroll-down indicator + dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        {/* Animated scroll-down arrow */}
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="text-white/60 hover:text-white transition-colors animate-bounce flex flex-col items-center gap-1"
          aria-label="scroll down"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span className="text-xs tracking-[0.2em]">向下滑动</span>
        </button>
        {/* Indicator dots */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => embla?.scrollTo(i)}
              className={`rounded-full transition-all duration-500 ${
                selected === i
                  ? "w-7 h-1.5 bg-white/90"
                  : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
