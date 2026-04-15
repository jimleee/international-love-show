interface Props {
  title: string;
  subtitle?: string;
  image: string;
}

export default function PageHero({ title, subtitle, image }: Props) {
  return (
    <section className="relative h-[45vh] min-h-[320px] overflow-hidden">
      <img src={image} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        {subtitle && (
          <p className="text-white/80 text-sm md:text-base tracking-[0.2em] uppercase mb-3">
            {subtitle}
          </p>
        )}
        <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg">{title}</h1>
      </div>
    </section>
  );
}
