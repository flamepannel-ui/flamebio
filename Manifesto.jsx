import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CHAPTERS = [
  {
    n: "01", tag: "origin",
    heading: ["i learned to code", "the way most kids", "learn video games —", "obsessively, at 3am."],
    body: "my first script was a telegram bot that woke me up if my exam results were out. it never slept. neither did i.",
  },
  {
    n: "02", tag: "craft",
    heading: ["python is not a language.", "it is a temperament.", "quiet, direct, honest.", "so am i."],
    body: "i build small tools that do one thing, correctly, forever. fastapi. aiogram. redis. a few well-placed cron jobs. no theatre.",
  },
  {
    n: "03", tag: "practice",
    heading: ["automation is empathy.", "every job you script away", "is an hour", "someone gets to breathe."],
    body: "i work best in the seam between messy human intent and clean machine output — bots, scrapers, orchestrators, glue.",
  },
  {
    n: "04", tag: "signal",
    heading: ["18 · india · online.", "hindi, english,", "and long stretches", "of no words at all."],
    body: "if what you're building sounds hard, weird, or unreasonably specific — that's usually the exact shape of thing i want to work on.",
  },
];

function Chapter({ chapter, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });

  return (
    <section ref={ref}
      className="relative min-h-[85vh] flex items-center py-24 sm:py-32 border-b border-green-500/15"
      data-testid={`chapter-${chapter.n}`}>
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 grid grid-cols-12 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-3">
          <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 mb-4">
            chapter {chapter.n} — {chapter.tag}
          </div>
          <div className="font-display text-[22vw] md:text-[10vw] leading-[0.85] text-green-500/10">
            {chapter.n}
          </div>
        </motion.div>

        <div className="col-span-12 md:col-span-9 md:pl-8">
          <h2 className="font-display uppercase text-green-100 text-3xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight">
            {chapter.heading.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={inView ? { y: "0%" } : {}}
                  transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.09 }}
                  className="block">
                  {i === chapter.heading.length - 1 ? (
                    <span>{line.slice(0, -1)}<span className="text-cyan-400 glow-cyan">{line.slice(-1)}</span></span>
                  ) : line}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="mt-10 max-w-2xl text-green-400/85 text-base sm:text-lg leading-relaxed">
            {chapter.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.35em] text-green-500/50">
            <span>ln {(index + 1) * 42}</span>
            <span>col 0</span><span>—</span>
            <span>utf-8</span><span>—</span>
            <span className="text-cyan-400">/log/{chapter.tag}.md</span>
          </motion.div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-6 sm:inset-x-10 top-6 bottom-6 border border-green-500/10 hud-clip-lg" />
    </section>
  );
}

export default function Manifesto() {
  return (
    <div id="manifesto">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-24 pb-6">
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-cyan-400/70">
          <span className="w-8 h-px bg-cyan-400/50" />
          manifesto :: 04 chapters :: scroll to decrypt
        </div>
      </div>
      {CHAPTERS.map((c, i) => <Chapter chapter={c} index={i} key={c.n} />)}
    </div>
  );
}