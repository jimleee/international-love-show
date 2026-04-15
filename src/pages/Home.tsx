import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import HeroCarousel from "@/components/home/HeroCarousel";
import ManifestoSection from "@/components/home/ManifestoSection";
import AboutSection from "@/components/home/AboutSection";
import AdvantagesSection from "@/components/home/AdvantagesSection";
import SixTeamsSection from "@/components/home/SixTeamsSection";
import CourseSystemSection from "@/components/home/CourseSystemSection";
import TeamShowcaseSection from "@/components/home/TeamShowcaseSection";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t("brand")}</title>
        <meta name="description" content={t("home.manifesto.subtitle") as string} />
      </Helmet>
      <HeroCarousel />
      <ManifestoSection />
      <AboutSection />
      <AdvantagesSection />
      <SixTeamsSection />
      <CourseSystemSection />
      <TeamShowcaseSection />
    </>
  );
}
