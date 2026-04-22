import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/PageHero";
import CaseStory from "@/components/successCases/CaseStory";

type Case = {
  id: string;
  title: string;
  images: string[];
  paragraphs: string[];
};

export default function SuccessCases() {
  const { t } = useTranslation();
  const cases = t("pages.successCases.cases", { returnObjects: true }) as Case[];

  return (
    <>
      <Helmet>
        <title>{t("pages.successCases.title") + " · " + t("brand")}</title>
        <meta name="description" content={t("pages.successCases.intro") as string} />
      </Helmet>

      <PageHero
        title={t("pages.successCases.title")}
        subtitle={t("pages.successCases.subtitle")}
        image="/images/stories/3.jpg"
      />

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-lg text-foreground/75 leading-relaxed">
            {t("pages.successCases.intro")}
          </p>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="container mx-auto max-w-5xl space-y-20 md:space-y-24">
          {cases.map((c, i) => (
            <CaseStory
              key={c.id}
              title={c.title}
              images={c.images}
              paragraphs={c.paragraphs}
              flip={i % 2 === 1}
            />
          ))}
        </div>
      </section>
    </>
  );
}
