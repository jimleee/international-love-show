import { useTranslation } from "react-i18next";

export default function VisionSection() {
  const { t } = useTranslation();
  return (
    <section className="py-12 md:py-14 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("pages.about.visionTitle")}</h2>
        <p className="text-base md:text-lg text-foreground/75 leading-relaxed">
          {t("pages.about.visionBody")}
        </p>
      </div>
    </section>
  );
}
