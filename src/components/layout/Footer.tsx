import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t bg-muted/30 mt-12">
      <div className="container mx-auto px-4 py-10 grid gap-6 md:grid-cols-2">
        <div>
          <div className="font-semibold mb-2">{t("brand")}</div>
          <div className="text-sm text-foreground/70">{t("footer.centers")}</div>
          <ul className="text-sm text-foreground/70 mt-1 space-y-0.5">
            <li>• {t("footer.losAngeles")}</li>
            <li>• {t("footer.sanFrancisco")}</li>
            <li>• {t("footer.lasVegas")}</li>
          </ul>
        </div>
        <div className="text-sm text-foreground/60 md:text-right self-end">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
