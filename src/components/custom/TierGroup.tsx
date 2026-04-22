import { Check } from "lucide-react";

export type Tier = {
  name: string;
  duration: string;
  asset?: string;
  scope?: string;
  features: string[];
};

type Props = {
  title: string;
  subtitle?: string;
  tiers: Tier[];
  variant?: "basic" | "premium";
};

export default function TierGroup({ title, subtitle, tiers, variant = "basic" }: Props) {
  const isPremium = variant === "premium";
  const cols = tiers.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section className={`py-20 px-4 ${isPremium ? "bg-gradient-to-b from-[#1a1a2a] to-[#0f0f1a] text-white" : ""}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
          {subtitle && (
            <p className={isPremium ? "text-white/60" : "text-foreground/60"}>{subtitle}</p>
          )}
        </div>
        <div className={`grid gap-6 sm:grid-cols-2 ${cols}`}>
          {tiers.map((t, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 flex flex-col ${
                isPremium
                  ? "bg-white/5 border border-white/10 backdrop-blur-sm"
                  : "bg-white shadow-sm"
              }`}
            >
              <h3 className="text-xl font-semibold">{t.name}</h3>
              <div className={`text-sm mt-1 ${isPremium ? "text-white/60" : "text-foreground/60"}`}>
                {t.duration}
              </div>
              {t.asset && (
                <div className={`mt-3 text-sm ${isPremium ? "text-amber-300" : "text-primary"}`}>
                  {t.asset}
                </div>
              )}
              {t.scope && (
                <div className={`mt-1 text-xs leading-relaxed ${isPremium ? "text-white/50" : "text-foreground/50"}`}>
                  {t.scope}
                </div>
              )}
              <ul className="mt-5 space-y-2.5 flex-1">
                {t.features.map((f, j) => (
                  <li key={j} className="flex gap-2 text-sm leading-relaxed">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isPremium ? "text-amber-300" : "text-primary"
                      }`}
                    />
                    <span className={isPremium ? "text-white/80" : "text-foreground/75"}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
