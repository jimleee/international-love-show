import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/PageHero";
import TierGroup, { type Tier } from "@/components/custom/TierGroup";

export default function Custom() {
  const { t } = useTranslation();
  const premium = t("pages.custom.premiumTiers", { returnObjects: true }) as Tier[];

  return (
    <>
      <Helmet>
        <title>{t("pages.custom.title") + " · " + t("brand")}</title>
      </Helmet>

      <PageHero title={t("pages.custom.title")} image="/images/custom/hero-bg.jpg" />

      <TierGroup title="" tiers={premium} variant="premium" />
    </>
  );
}
