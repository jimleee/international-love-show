type Props = {
  name: string;
  items: string[];
};

const GOLD_GRADIENT = "linear-gradient(180deg, #f6e3a8 0%, #d8a13a 50%, #b07820 100%)";

export default function TierSlide({ name, items }: Props) {
  return (
    <section
      className="relative bg-black text-white overflow-hidden"
      style={{
        backgroundImage: "url('/images/custom/tier-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative container mx-auto max-w-3xl px-6 py-20 md:py-28">
        <h2
          className="text-center text-4xl md:text-6xl font-extrabold tracking-wider"
          style={{
            background: GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: '"Noto Serif SC", "Songti SC", "STSong", serif',
          }}
        >
          {name}
        </h2>
        <img
          src="/images/custom/gold-streak.png"
          alt=""
          className="mx-auto mt-2 mb-10 h-8 md:h-10 w-3/4 max-w-md object-contain"
        />
        <ol className="space-y-4 md:space-y-5 text-base md:text-xl px-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-3 md:gap-5">
              <span
                className="font-bold tabular-nums shrink-0 text-xl md:text-2xl"
                style={{
                  background: GOLD_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span className="leading-relaxed text-amber-50/95">{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
