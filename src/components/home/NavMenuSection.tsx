import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";

const ITEMS = [
  { to: "/about", key: "nav.about", image: "/images/carousel/slide-1.png" },
  { to: "/one-on-one", key: "nav.oneOnOne", image: "/images/carousel/slide-2.png" },
  { to: "/custom", key: "nav.custom", image: "/images/carousel/slide-4.png" },
  { to: "/party", key: "nav.party", image: "/images/party/5.jpg" },
  { to: "/wedding-gallery", key: "nav.weddingGallery", image: "/images/stories/3.jpg" },
  { to: "/success-cases", key: "nav.successCases", image: "/images/stories/7.jpg" },
];

export default function NavMenuSection() {
  const { t } = useTranslation();
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3">
        {ITEMS.map(({ to, key, image }) => (
          <Link
            key={to}
            to={to}
            className="group relative block overflow-hidden rounded-2xl aspect-[4/3] shadow-md hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Bottom gradient band only, leaves the image's own text/visual untouched */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 px-5 py-4 flex items-end justify-between text-white">
              <div>
                <div className="text-lg md:text-xl font-semibold tracking-wide drop-shadow-md">
                  {t(key)}
                </div>
                <div className="mt-1 h-0.5 w-8 bg-white/70 group-hover:w-16 transition-all duration-300" />
              </div>
              <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-white/30 transition">
                <ArrowUpRight size={18} className="group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
