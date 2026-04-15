import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Heart, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";

const FEATURED_COUNT = 3;

type Case = { names: string; title: string; location: string; story: string };

export default function SuccessCases() {
  const { t } = useTranslation();
  const cases = t("pages.successCases.cases", { returnObjects: true }) as Case[];
  const items = cases.map((c, i) => ({ ...c, image: `/images/stories/${i + 1}.jpg` }));
  const featured = items.slice(0, FEATURED_COUNT);
  const grid = items.slice(FEATURED_COUNT);

  const [idx, setIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (n: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setIdx(n);
      setTimeout(() => setTransitioning(false), 500);
    },
    [transitioning]
  );

  const goNext = useCallback(() => goTo((idx + 1) % FEATURED_COUNT), [idx, goTo]);
  const goPrev = useCallback(() => goTo((idx - 1 + FEATURED_COUNT) % FEATURED_COUNT), [idx, goTo]);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  const current = featured[idx];

  return (
    <>
      <Helmet>
        <title>{t("pages.successCases.title") + " · " + t("brand")}</title>
        <meta name="description" content={t("pages.successCases.intro") as string} />
      </Helmet>

      <PageHero
        title={t("pages.successCases.title")}
        subtitle={t("pages.successCases.subtitle")}
        image="/images/stories/7.jpg"
      />

      <section className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">{t("pages.successCases.intro")}</p>
      </section>

      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white border">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-1/2 h-72 md:h-[420px] overflow-hidden">
                  {featured.map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.names}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === idx ? "opacity-100" : "opacity-0"}`}
                    />
                  ))}
                  <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                    {t("pages.successCases.featured")}
                  </div>
                </div>

                <div className="flex flex-col justify-center w-full md:w-1/2 p-6 md:p-10">
                  <div className={`transition-all duration-500 ${transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-primary fill-primary" />
                      <h3 className="text-xl md:text-2xl font-semibold">{current.names}</h3>
                    </div>
                    <p className="text-sm font-medium text-primary mb-2">{current.title}</p>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{current.location}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{current.story}</p>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="flex gap-2">
                      {featured.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i)}
                          className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                          aria-label={`go to story ${i + 1}`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={goPrev} className="w-8 h-8 rounded-full">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={goNext} className="w-8 h-8 rounded-full">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {grid.map((item, i) => (
            <Card key={i} className="rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="relative h-40 md:h-48 overflow-hidden">
                <img src={item.image} alt={item.names} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-white fill-white" />
                    <span className="text-white text-xs md:text-sm font-semibold truncate">{item.names}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-3 md:p-4">
                <p className="text-xs font-medium text-primary mb-1">{item.title}</p>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3">{item.story}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
