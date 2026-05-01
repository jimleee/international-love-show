import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/PageHero";
import TierSlide from "@/components/custom/TierSlide";
import type { Tier } from "@/components/custom/TierGroup";

export default function Custom() {
  const { t } = useTranslation();
  const premium = t("pages.custom.premiumTiers", { returnObjects: true }) as Tier[];

  return (
    <>
      <Helmet>
        <title>{t("pages.custom.title") + " · " + t("brand")}</title>
      </Helmet>

      <PageHero title={t("pages.custom.title")} image="/images/custom/hero-bg.jpg" />

      {premium.map((tier, i) => {
        const items = [
          tier.duration,
          tier.features[0],
          tier.asset ?? "",
          tier.scope ? `${t("pages.custom.scopeLabel")}${tier.scope}` : "",
          tier.features[1],
          tier.features[2],
          tier.features[3],
        ].filter(Boolean);
        return (
          <TierSlide key={i} name={`${tier.name}${t("pages.custom.tierSuffix")}`} items={items} />
        );
      })}
    </>
  );
}
