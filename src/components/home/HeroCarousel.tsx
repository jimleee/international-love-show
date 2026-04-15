import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = Array.from({ length: 8 }, (_, i) => ({
  src: `/images/carousel/slide-${i + 1}.png`,
  textKey: `home.carousel.slide${i + 1}`,
}));

export default function HeroCarousel() {
  const { t } = useTranslation();
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
    <section className="relative w-full overflow-hidden" style={{ height: "80vh", minHeight: 480 }}>
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {SLIDES.map((s, i) => (
            <div key={i} className="relative flex-[0_0_100%] h-full">
              <img src={s.src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <h2 className="text-white text-2xl md:text-5xl font-bold text-center max-w-4xl drop-shadow-lg">
                  {t(s.textKey)}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => embla?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-2 rounded-full"
        aria-label="prev"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => embla?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-2 rounded-full"
        aria-label="next"
      >
        <ChevronRight />
      </button>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => embla?.scrollTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition ${selected === i ? "bg-white" : "bg-white/40"}`}
            aria-label={`go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
