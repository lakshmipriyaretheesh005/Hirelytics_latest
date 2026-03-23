import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const stats = [
  { value: "120+", label: "Recruiting Companies" },
  { value: "87%", label: "Placement Rate" },
  { value: "₹8.2L", label: "Average Package" },
  { value: "1,200+", label: "Students Placed" },
];

const StatsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="stats" className="py-20 bg-primary" ref={ref}>
      <div className="container mx-auto section-padding">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`text-center ${isVisible ? `animate-fade-up stagger-${i + 1}` : "opacity-0"}`}
            >
              <p className="font-display font-bold text-3xl sm:text-4xl tabular-nums text-primary-foreground mb-1">
                {s.value}
              </p>
              <p className="text-sm text-primary-foreground/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
