import { useTranslation } from "react-i18next";

export default function MissionSection() {
  const { t } = useTranslation();
  return (
    <section className="py-12 md:py-14 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("pages.about.missionTitle")}</h2>
        <p className="text-base md:text-lg text-foreground/75 leading-relaxed">
          {t("pages.about.missionBody")}
        </p>
      </div>
    </section>
  );
}
