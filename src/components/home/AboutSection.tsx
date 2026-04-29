import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation();
  return (
    <section className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
      <img
        src="/images/home/about-us.jpg"
        alt=""
        className="rounded-2xl shadow-lg w-full h-80 object-cover"
      />
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("home.about.title")}</h2>
        <p className="text-foreground/70 leading-relaxed">{t("home.about.body")}</p>
      </div>
    </section>
  );
}
