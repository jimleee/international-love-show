import { useTranslation } from "react-i18next";

export default function MissionSection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("pages.about.missionTitle")}</h2>
        <p className="text-lg text-foreground/75 leading-loose">
          {t("pages.about.missionBody")}
        </p>
      </div>
    </section>
  );
}
