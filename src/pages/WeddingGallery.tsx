import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";
import PageHero from "@/components/PageHero";

const PHOTOS = [
  "150d31f744a67512941b7b5995d33adc.jpg",
  "34577dd769f7fa4a2e977488da4870db.jpg",
  "348414e7738226196e2b16002b2e5f36.jpg",
  "3e02680df4df20cfbd5ba7717805cc08.jpg",
  "495b1847e20d5874a5757efb2d88f100.jpg",
  "4bd36c9e7788481e4fadc2ab50b1b235.jpg",
  "6548db334b80b798cb65bd6dc5e16373.jpg",
  "6a10e5a3223ab8e02e201ef1ddf017b7.jpg",
  "71672e63b7c001268255bcea85c4a741.jpg",
  "8f2746306b12fadc4f2f179e895ea89d.jpg",
  "9ef92e513e3f111fcd20a1d6f2da6531.jpg",
  "b12b1fe38b3c7704ab892b03cc1a15ea.jpg",
  "b4a5d3e0f8dd78aac218e275b6fe8c2a.jpg",
  "cfd56b140f77fd1c6c443566c87569f2.jpg",
  "d4a009d2000707af68ea4a7cb5fc5428.jpg",
  "d8dad012454eba586088c7a7107161e5.jpg",
  "df126b2d47516d96c92cb80c1d509b0d.jpg",
  "e180012601968155a6fbdf94b12418e6.jpg",
  "e1e578366f50f29ac4120e4ad360853b.jpg",
  "e5219da5bf3d16fa717221bab72cbb42.jpg",
  "e9698b0a93631f59660946b9c38039d1.jpg",
].map((f) => `/images/wedding/${f}`);

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
