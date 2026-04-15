import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { UserPlus, ShieldCheck, MessageCircle, Sparkles, Send, Heart } from "lucide-react";
import PageHero from "@/components/PageHero";

const ICONS = [UserPlus, ShieldCheck, MessageCircle, Sparkles, Send, Heart];

type Step = { title: string; desc: string };

export default function OneOnOne() {
  const { t } = useTranslation();
  const steps = t("pages.oneOnOne.steps", { returnObjects: true }) as Step[];

  return (
    <>
      <Helmet>
        <title>{t("pages.oneOnOne.title") + " · " + t("brand")}</title>
        <meta name="description" content={t("pages.oneOnOne.intro") as string} />
      </Helmet>

      <PageHero
        title={t("pages.oneOnOne.title")}
        subtitle={t("pages.oneOnOne.subtitle")}
        image="/images/carousel/slide-2.png"
      />

      <section className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">{t("pages.oneOnOne.intro")}</p>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold">{t("pages.oneOnOne.processTitle")}</h2>
            <p className="text-muted-foreground mt-2">{t("pages.oneOnOne.processSubtitle")}</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
            <div className="space-y-8 md:space-y-12">
              {steps.map((step, index) => {
                const Icon = ICONS[index];
                const isLeft = index % 2 === 0;
                return (
                  <div key={index} className={`flex flex-col md:flex-row items-center gap-4 md:gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">{index + 1}</span>
                    </div>
                    <div className="hidden md:block flex-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src="/images/home/consultation.jpg" alt="" className="w-full h-64 md:h-96 object-cover" />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-5">
            <h3 className="text-2xl md:text-3xl font-semibold">{t("pages.oneOnOne.coachTitle")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("pages.oneOnOne.coachBody")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
