import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import axios from "axios";
import BootSequence from "@/components/BootSequence";
import Scanlines from "@/components/Scanlines";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import ProfileHUD from "@/components/ProfileHUD";
import EditorialMarquee from "@/components/EditorialMarquee";
import Manifesto from "@/components/Manifesto";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Portfolio() {
  const [booting, setBooting] = useState(true);
  const [visitors, setVisitors] = useState(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -120]);
  const y2 = useTransform(scrollY, [0, 800], [0, 60]);
  const rot = useTransform(scrollY, [0, 1200], [0, 8]);

  useEffect(() => {
    let mounted = true;
    axios.post(`${API}/visits`)
      .then((r) => mounted && setVisitors(r.data.count))
      .catch(async () => {
        try { const r = await axios.get(`${API}/visits`); if (mounted) setVisitors(r.data.count); }
        catch { /* silent */ }
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-green-400 grid-bg vignette overflow-x-hidden">
      <Scanlines />
      {booting && <BootSequence onFinish={() => setBooting(false)} />}

      <header className="fixed top-0 inset-x-0 z-40 border-b border-green-500/15 bg-black/70 backdrop-blur-md" data-testid="top-bar">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 py-3 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em]">
          <span className="flex items-center gap-2 text-green-300">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#00ff41] animate-pulse" />
            trgdm.sh
          </span>
          <span className="hidden sm:inline text-green-500/50">·</span>
          <span className="hidden sm:inline text-green-500/60">v4.19.2</span>
          <span className="ml-auto hidden md:flex items-center gap-6 text-green-500/60">
            <a href="#terminal" className="hover:text-cyan-300 transition-colors" data-testid="nav-terminal">terminal</a>
            <a href="#manifesto" className="hover:text-cyan-300 transition-colors" data-testid="nav-manifesto">manifesto</a>
            <a href="#contact" className="hover:text-cyan-300 transition-colors" data-testid="nav-contact">contact</a>
          </span>
          <span className="text-cyan-400/80">{new Date().toISOString().split("T")[0]}</span>
        </div>
      </header>

      <section id="terminal" className="relative pt-24 pb-16 sm:pt-28 sm:pb-24">
        <motion.div style={{ y: y1, rotate: rot }}
          className="pointer-events-none absolute -right-24 top-16 font-display text-[36vw] leading-none text-green-500/[0.035] select-none"
          aria-hidden>$_</motion.div>
        <motion.div style={{ y: y2 }}
          className="pointer-events-none absolute -left-8 top-40 font-display text-[16vw] leading-none text-cyan-400/[0.03] select-none rotate-[-8deg]"
          aria-hidden>//</motion.div>

        <div className="max-w-[1600px] mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-cyan-400/80">
            <span className="w-8 h-px bg-cyan-400/60" />
            <span>terminal · portfolio · v1.0</span>
            <span className="ml-auto hidden sm:inline text-green-500/60">connected · latency 12ms · encrypted</span>
          </div>

          <h1 className="mt-6 font-display uppercase text-green-100 leading-[0.88] tracking-tight text-[14vw] sm:text-[10vw] md:text-[8.5vw]">
            <MaskedLine delay={0}>i script</MaskedLine>
            <MaskedLine delay={0.12}>the boring parts</MaskedLine>
            <MaskedLine delay={0.24}>
              of the <span className="text-cyan-400 glow-cyan">internet.</span>
            </MaskedLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-8 max-w-2xl text-green-400/85 text-base sm:text-lg leading-relaxed">
            <span className="text-cyan-400">&gt;</span> access granted. i'm{" "}
            <span className="text-green-300 glow-green">@trgdm</span> — a python developer,
            api architect and bot engineer building automation &amp; intelligence for people
            who'd rather not click 400 times a day.
          </motion.p>

          <div className="mt-14 grid grid-cols-12 gap-5 lg:gap-8">
            <div className="col-span-12 lg:col-span-8">
              <InteractiveTerminal />
              <div className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-green-500/50">
                <span className="cursor-block !w-2 !h-2" />
                <span>live shell</span>
                <span className="ml-auto text-cyan-400/70">focus &amp; type — the terminal is real</span>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4">
              <ProfileHUD visitors={visitors} />
            </div>
          </div>
        </div>
      </section>

      <EditorialMarquee />
      <Manifesto />
      <FooterContact />
    </div>
  );
}

function MaskedLine({ children, delay = 0 }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "110%" }} animate={{ y: "0%" }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.55 + delay }}
        className="block">
        {children}
      </motion.span>
    </span>
  );
}

function FooterContact() {
  return (
    <footer id="contact" className="relative py-24 sm:py-32 border-t border-green-500/15" data-testid="footer">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-cyan-400/80">
          <span className="w-8 h-px bg-cyan-400/60" />
          end of transmission · open a channel
        </div>

        <div className="mt-8 grid grid-cols-12 gap-6 items-end">
          <h3 className="col-span-12 md:col-span-8 font-display uppercase text-green-100 text-5xl sm:text-7xl md:text-8xl leading-[0.9] tracking-tight">
            <span className="block overflow-hidden">
              <motion.span initial={{ y: "110%" }} whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="block">
                say hi.
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span initial={{ y: "110%" }} whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }} className="block">
                bring a <span className="text-cyan-400 glow-cyan">weird idea.</span>
              </motion.span>
            </span>
          </h3>

          <div className="col-span-12 md:col-span-4 md:justify-self-end w-full md:w-auto">
            <a href="https://t.me/trgdm" target="_blank" rel="noopener noreferrer"
              className="group edge-green corner-notch bg-green-500/10 hover:bg-green-500/20 block px-6 py-5 text-sm uppercase tracking-[0.28em] text-green-300 transition-colors"
              data-testid="footer-telegram-cta">
              <div className="text-[10px] text-green-500/60 mb-2">encrypted channel</div>
              <div className="text-xl text-green-200 flex items-center gap-3">
                telegram / @trgdm
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">↗</span>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-green-500/15 pt-6 flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.35em] text-green-500/50">
          <span>© {new Date().getFullYear()} trgdm.sh</span>
          <span>—</span>
          <span>built in a terminal, for the terminal</span>
          <span className="ml-auto flex items-center gap-2 text-green-400/70">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#00ff41] animate-pulse" />
            all systems nominal
          </span>
        </div>
      </div>
    </footer>
  );
}