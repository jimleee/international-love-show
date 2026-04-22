type Props = {
  title: string;
  images: string[];
  paragraphs: string[];
  flip: boolean;
};

export default function CaseStory({ title, images, paragraphs, flip }: Props) {
  return (
    <article
      className={`flex flex-col gap-8 md:gap-12 items-center ${
        flip ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <div className="w-full md:w-5/12 space-y-4">
        {images.map((src, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-lg">
            <img src={src} alt="" className="w-full h-auto object-cover" loading="lazy" />
          </div>
        ))}
      </div>
      <div className="w-full md:w-7/12 space-y-4">
        <h3 className="text-2xl md:text-3xl font-semibold leading-snug">{title}</h3>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-foreground/75 leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}
