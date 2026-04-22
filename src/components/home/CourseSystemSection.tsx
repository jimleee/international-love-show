import { useTranslation } from "react-i18next";

const COURSE_IMAGES = [
  "/images/courses/course-1.jpg",
  "/images/courses/course-2.jpg",
  "/images/courses/course-3.jpg",
  "/images/courses/course-4.png",
  "/images/courses/course-5.jpg",
  "/images/courses/course-6.jpg",
];

export default function CourseSystemSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-muted/30 py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t("home.courseSystem.title")}
          </h2>
          <p className="text-foreground/60">{t("home.courseSystem.subtitle")}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {COURSE_IMAGES.map((src, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden shadow-sm bg-white aspect-[16/9]"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
