import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/PageHero";

// NOTE: This is a temporary shim — Task 12 will rewrite this page
// to render the new cases shape (id/title/images/paragraphs[]).

export default function SuccessCases() {
  const { t } = useTranslation();

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
    </>
  );
}
