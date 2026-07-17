import Marquee from "react-fast-marquee";

export default function EditorialMarquee() {
  const items = [
    "python developer",
    "api architect",
    "bot engineer",
    "automation & intelligence",
    "async · webhooks · pipelines",
  ];
  return (
    <section
      className="border-y border-green-500/20 bg-black/60 py-5 marquee-mask overflow-hidden"
      data-testid="editorial-marquee"
    >
      <Marquee gradient={false} speed={38} pauseOnHover>
        {items.concat(items).map((it, i) => (
          <span key={i} className="flex items-center gap-8 px-8">
            <span className="font-display text-4xl sm:text-6xl md:text-7xl uppercase text-green-300/90 whitespace-nowrap tracking-tight">
              {it}
            </span>
            <span className="text-cyan-400 text-3xl">◆</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}