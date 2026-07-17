import { motion } from "framer-motion";
import { Send, ShieldCheck, Terminal, Zap } from "lucide-react";

const AVATAR = "https://images.unsplash.com/photo-1544502062-f82887f03d1c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwzfHxoYWNrZXIlMjBzaWxob3VldHRlJTIwcG9ydHJhaXQlMjBkYXJrfGVufDB8fHx8MTc4NDI4MjYwNHww&ixlib=rb-4.1.0&q=85";

const roles = [
  { icon: Terminal, label: "python developer" },
  { icon: Zap, label: "api architect · bot engineer" },
  { icon: ShieldCheck, label: "automation & intelligence" },
];

const stats = [
  { k: "age", v: "18" },
  { k: "work", v: "I/" },
  { k: "language", v: "HI / EN" },
  { k: "country", v: "INDIA — IN" },
];

export default function ProfileHUD({ visitors }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
      className="relative" data-testid="profile-hud"
    >
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-cyan-400/70">
        <span>identity :: 0x·trgdm</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#00ff41] animate-pulse" />
          verified
        </span>
      </div>

      <div className="relative edge-cyan hud-clip-lg bg-black/70 backdrop-blur-sm p-6 sm:p-7">
        <Crosshair className="top-2 left-2" />
        <Crosshair className="top-2 right-2" flip />
        <Crosshair className="bottom-2 left-2" flipY />
        <Crosshair className="bottom-2 right-2" flip flipY />

        <div className="flex items-start gap-5">
          <div className="relative">
            <div className="edge-green hud-clip w-20 h-20 sm:w-24 sm:h-24 overflow-hidden bg-black">
              <img src={AVATAR} alt="@trgdm avatar" className="w-full h-full object-cover grayscale contrast-125 opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-cyan-500/20 mix-blend-screen" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 shadow-[0_0_12px_#00ff41] rounded-full ring-2 ring-black" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.35em] text-green-500/60">handle</div>
            <div className="font-display text-3xl sm:text-4xl text-green-300 glow-green leading-none mt-1">@trgdm</div>
            <div className="mt-3 text-xs text-cyan-400/80 uppercase tracking-[0.28em]">node · in-pnq-01</div>
          </div>
        </div>

        <ul className="mt-6 space-y-2">
          {roles.map((r, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <r.icon size={14} className="text-cyan-400 shrink-0" />
              <span className="text-green-400/90 lowercase">{r.label}</span>
            </li>
          ))}
        </ul>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-green-500/20" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-green-500/50">stats</span>
          <div className="h-px flex-1 bg-green-500/20" />
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          {stats.map((s) => (
            <div key={s.k} className="group">
              <dt className="text-[10px] uppercase tracking-[0.3em] text-green-500/50">{s.k}</dt>
              <dd className="mt-1 text-sm text-green-300 group-hover:text-cyan-300 transition-colors">{s.v}</dd>
            </div>
          ))}
        </dl>

        <a href="https://t.me/trgdm" target="_blank" rel="noopener noreferrer"
          data-testid="telegram-cta"
          className="mt-7 group relative inline-flex w-full items-center justify-between gap-3 edge-green corner-notch bg-green-500/10 hover:bg-green-500/20 px-5 py-3 text-sm uppercase tracking-[0.28em] text-green-300 transition-colors">
          <span className="flex items-center gap-3">
            <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
            ping @trgdm on telegram
          </span>
          <span className="text-cyan-400 group-hover:text-cyan-300">↗</span>
        </a>

        <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-green-500/50">
          <span>signal :: strong</span>
          <span data-testid="visitor-count">
            visits <span className="text-cyan-400">{visitors ?? "----"}</span>
          </span>
        </div>
      </div>
    </motion.aside>
  );
}

function Crosshair({ className = "", flip = false, flipY = false }) {
  return (
    <span className={`absolute w-3 h-3 pointer-events-none ${className}`}
      style={{ transform: `scale(${flip ? -1 : 1}, ${flipY ? -1 : 1})` }} aria-hidden="true">
      <span className="absolute top-0 left-0 w-3 h-px bg-cyan-400/70" />
      <span className="absolute top-0 left-0 w-px h-3 bg-cyan-400/70" />
    </span>
  );
}
