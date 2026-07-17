import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  { t: "[ 0.000012 ] booting kernel :: trgdm.os v4.19.2", c: "cyan" },
  { t: "[ 0.014302 ] mounting /dev/dreams :: OK", c: "dim" },
  { t: "[ 0.028114 ] initializing crypto handshake", c: "dim" },
  { t: "[ 0.061290 ] loading ident:trgdm@in-pnq-01", c: "dim" },
  { t: "[ 0.084451 ] verifying biometric signature.......... OK", c: "green" },
  { t: "[ 0.132890 ] verifying 2FA token :: ***-***-8829 :: OK", c: "green" },
  { t: "[ 0.174441 ] injecting python runtime 3.12.7", c: "cyan" },
  { t: "[ 0.221008 ] mounting bot cluster :: 14 nodes online", c: "dim" },
  { t: "[ 0.290612 ] status :: verified user login successful", c: "green-bold" },
  { t: "> ACCESS GRANTED ......................... [OK]", c: "cyan-bold" },
];

export default function BootSequence({ onFinish }) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (idx >= LINES.length) {
      const t = setTimeout(() => setDone(true), 620);
      return () => clearTimeout(t);
    }
    const delay = idx === LINES.length - 1 ? 380 : 90 + Math.random() * 180;
    const t = setTimeout(() => setIdx((i) => i + 1), delay);
    return () => clearTimeout(t);
  }, [idx]);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => onFinish?.(), 480);
      return () => clearTimeout(t);
    }
  }, [done, onFinish]);

  const colorFor = (c) => ({
    cyan: "text-cyan-400",
    green: "text-green-400",
    dim: "text-green-500/60",
    "green-bold": "text-green-300 glow-green",
    "cyan-bold": "text-cyan-300 glow-cyan",
  }[c] || "text-green-500");

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center"
          data-testid="boot-sequence"
        >
          <div className="w-full max-w-3xl px-6 sm:px-10 font-mono text-sm sm:text-base">
            <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-green-500/60">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_#00ff41] animate-pulse" />
              <span>trgdm@terminal</span>
              <span className="ml-auto text-green-500/40">secure shell // sha-256</span>
            </div>
            <div className="edge-green hud-clip bg-black/60 p-6 sm:p-8 space-y-2">
              {LINES.slice(0, idx).map((line, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`${colorFor(line.c)} leading-relaxed`}>
                  {line.t}
                </motion.div>
              ))}
              {idx < LINES.length && (
                <div className="text-green-400/50"><span className="cursor-block" /></div>
              )}
              {idx >= LINES.length && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="pt-4 text-green-300 glow-green">
                  welcome, @trgdm.
                </motion.div>
              )}
            </div>
            <div className="mt-4 flex justify-between text-[10px] uppercase tracking-[0.3em] text-green-500/40">
              <span>node :: in-pnq-01</span>
              <span>uptime :: 00:00:00</span>
              <span>load :: 0.42 0.31 0.28</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}