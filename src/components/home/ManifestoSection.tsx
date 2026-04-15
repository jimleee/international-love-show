import { useTranslation } from "react-i18next";

export default function ManifestoSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-primary/5 py-20 px-4 text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-primary">{t("home.manifesto.title")}</h2>
      <p className="mt-4 text-lg md:text-xl text-foreground/70">{t("home.manifesto.subtitle")}</p>
    </section>
  );
}
