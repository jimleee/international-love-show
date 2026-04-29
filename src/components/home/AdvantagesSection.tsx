import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

type Item = { title: string; desc: string };

export default function AdvantagesSection() {
  const { t } = useTranslation();
  const items = t("home.advantages.items", { returnObjects: true }) as Item[];

  return (
    <section className="bg-muted/30 py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t("home.advantages.title")}</h2>
        <div className="max-w-5xl mx-auto mb-12 overflow-hidden rounded-2xl shadow-lg aspect-[16/9]">
          <img
            src="/images/home/advantages.jpg"
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Card key={i} className="text-center">
              <CardContent className="pt-8 pb-6">
                <CheckCircle2 className="mx-auto text-primary mb-3" size={32} />
                <h3 className="font-semibold text-lg mb-2">{it.title}</h3>
                <p className="text-sm text-foreground/70">{it.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
