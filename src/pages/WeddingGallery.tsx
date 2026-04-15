import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";
import PageHero from "@/components/PageHero";

const PHOTOS = [
  ...Array.from({ length: 15 }, (_, i) => `/images/stories/${i + 1}.jpg`),
  ...Array.from({ length: 12 }, (_, i) => `/images/party/${i + 30}.jpg`),
];

export default function WeddingGallery() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("pages.weddingGallery.title") + " · " + t("brand")}</title>
        <meta name="description" content={t("pages.weddingGallery.intro") as string} />
      </Helmet>

      <PageHero
        title={t("pages.weddingGallery.title")}
        subtitle={t("pages.weddingGallery.subtitle")}
        image="/images/stories/3.jpg"
      />

      <section className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">{t("pages.weddingGallery.intro")}</p>
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4 max-w-7xl mx-auto">
          {PHOTOS.map((src, i) => (
            <div key={i} className="break-inside-avoid overflow-hidden rounded-xl shadow-md group">
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary/5 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Quote className="w-10 h-10 text-primary mx-auto mb-4" />
          <p className="text-xl md:text-2xl font-serif italic text-foreground/80 leading-relaxed">
            {t("pages.weddingGallery.quote")}
          </p>
        </div>
      </section>
    </>
  );
}
