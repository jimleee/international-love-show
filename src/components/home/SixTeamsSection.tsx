import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

type Team = { name: string; desc: string };

export default function SixTeamsSection() {
  const { t } = useTranslation();
  const items = t("home.sixTeams.items", { returnObjects: true }) as Team[];

  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("home.sixTeams.title")}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((tm, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{tm.name}</h3>
                <p className="text-sm text-foreground/70">{tm.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
