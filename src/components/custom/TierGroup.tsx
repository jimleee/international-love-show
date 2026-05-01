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
  image?: string;
};

const GOLD_GRADIENT = "linear-gradient(180deg, #ffe9b5 0%, #e6b65a 45%, #b07820 100%)";
const goldText = {
  background: GOLD_GRADIENT,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

export default function TierGroup({ title, subtitle, tiers, variant = "basic", image }: Props) {
  const isPremium = variant === "premium";
  const cols = tiers.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section
      className={`relative py-20 px-4 ${isPremium ? "text-white bg-black" : ""}`}
      style={
        isPremium
          ? {
              backgroundImage: "url('/images/custom/tier-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }
          : undefined
      }
    >
      {isPremium && <div className="absolute inset-0 bg-black/55 pointer-events-none" />}

      <div className="relative container mx-auto max-w-7xl">
        {title && (
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={isPremium ? { ...goldText, fontFamily: '"Noto Serif SC", serif' } : undefined}
            >
              {title}
            </h2>
            {subtitle && (
              <p className={isPremium ? "text-amber-100/70" : "text-foreground/60"}>{subtitle}</p>
            )}
          </div>
        )}
        {image && (
          <div
            className={`mb-10 md:mb-12 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg ${
              isPremium ? "ring-1 ring-amber-300/30" : ""
            }`}
          >
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="w-full h-56 md:h-72 object-cover"
            />
          </div>
        )}
        <div className={`grid gap-6 sm:grid-cols-2 ${cols}`}>
          {tiers.map((t, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 flex flex-col ${
                isPremium
                  ? "bg-black/55 border border-amber-300/25 backdrop-blur-sm shadow-[0_15px_40px_-15px_rgba(212,165,78,0.4)]"
                  : "bg-white shadow-sm"
              }`}
            >
              <h3
                className="text-xl font-bold tracking-wide"
                style={isPremium ? goldText : undefined}
              >
                {t.name}
              </h3>
              <div
                className={`text-sm mt-1 ${isPremium ? "text-amber-100/65" : "text-foreground/60"}`}
              >
                {t.duration}
              </div>
              {t.asset && (
                <div
                  className={`mt-3 text-sm font-semibold ${isPremium ? "" : "text-primary"}`}
                  style={isPremium ? goldText : undefined}
                >
                  {t.asset}
                </div>
              )}
              {t.scope && (
                <div
                  className={`mt-1 text-xs leading-relaxed ${
                    isPremium ? "text-amber-100/55" : "text-foreground/50"
                  }`}
                >
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
                    <span className={isPremium ? "text-amber-50/90" : "text-foreground/75"}>
                      {f}
                    </span>
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
