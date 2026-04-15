import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, UserRound, Sparkles, PartyPopper, Heart, Trophy } from "lucide-react";

const ITEMS = [
  { to: "/about", key: "nav.about", Icon: Building2, image: "/images/carousel/slide-1.png" },
  { to: "/one-on-one", key: "nav.oneOnOne", Icon: UserRound, image: "/images/carousel/slide-2.png" },
  { to: "/custom", key: "nav.custom", Icon: Sparkles, image: "/images/carousel/slide-4.png" },
  { to: "/party", key: "nav.party", Icon: PartyPopper, image: "/images/carousel/slide-7.png" },
  { to: "/wedding-gallery", key: "nav.weddingGallery", Icon: Heart, image: "/images/carousel/slide-3.png" },
  { to: "/success-cases", key: "nav.successCases", Icon: Trophy, image: "/images/carousel/slide-5.png" },
];

export default function NavMenuSection() {
  const { t } = useTranslation();
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
        {ITEMS.map(({ to, key, Icon, image }) => (
          <Link
            key={to}
            to={to}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-md hover:shadow-xl transition"
          >
            <img
              src={image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <Icon size={40} className="mb-3 drop-shadow-lg" />
              <div className="text-xl md:text-2xl font-semibold drop-shadow-lg">{t(key)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
