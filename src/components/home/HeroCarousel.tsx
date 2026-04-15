import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = Array.from({ length: 8 }, (_, i) => ({
  src: `/images/carousel/slide-${i + 1}.png`,
  textKey: `home.carousel.slide${i + 1}`,
}));

export default function HeroCarousel() {
  const { t, i18n } = useTranslation();
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  // In zh mode, the slide images already contain the Chinese marketing copy —
  // showing the caption would duplicate and visually clash. Only show caption overlay
  // for non-zh locales where the baked-in Chinese text doesn't match the UI language.
  const showCaption = !i18n.language.startsWith("zh");

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
    <section className="relative w-full overflow-hidden" style={{ height: "80vh", minHeight: 480 }}>
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {SLIDES.map((s, i) => (
            <div key={i} className="relative flex-[0_0_100%] h-full">
              <img src={s.src} alt="" className="w-full h-full object-cover" />
              {showCaption && (
                <>
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-16 left-6 md:left-12 max-w-xl">
                    <div className="inline-block bg-black/40 backdrop-blur-md border-l-2 border-white/80 px-4 py-3">
                      <div className="text-white/70 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-1">
                        {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
                      </div>
                      <div className="text-white text-base md:text-xl font-medium leading-snug">
                        {t(s.textKey)}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => embla?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm transition"
        aria-label="prev"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => embla?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm transition"
        aria-label="next"
      >
        <ChevronRight />
      </button>

      {/* Indicators — anchored bottom-right to avoid the image's own baked-in subtitle near bottom-center */}
      <div className="absolute bottom-5 right-6 md:right-12 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => embla?.scrollTo(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              selected === i ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
