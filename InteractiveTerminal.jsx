import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const HELP = [
  { cmd: "help", desc: "list all available commands" },
  { cmd: "about", desc: "who is @trgdm?" },
  { cmd: "skills", desc: "tech stack + specialisations" },
  { cmd: "stats", desc: "identity block :: age, work, lang, country" },
  { cmd: "contact", desc: "open telegram :: @trgdm" },
  { cmd: "sudo hire", desc: "the important one" },
  { cmd: "clear", desc: "wipe the screen" },
];

const INITIAL = [
  { type: "sys", text: "trgdm@terminal :: interactive shell v1.0" },
  { type: "sys", text: "type 'help' to list commands. type 'contact' to reach out." },
  { type: "sys", text: "" },
];

export default function InteractiveTerminal() {
  const [history, setHistory] = useState(INITIAL);
  const [value, setValue] = useState("");
  const [past, setPast] = useState([]);
  const [pi, setPi] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [history]);

  const push = (entries) => setHistory((h) => [...h, ...entries]);

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    push([{ type: "prompt", text: raw }]);
    if (!cmd) return;
    switch (cmd) {
      case "help":
        push(HELP.map((h) => ({ type: "kv", k: h.cmd, v: h.desc })));
        break;
      case "about":
        push([
          { type: "out", text: "> @trgdm — python developer & bot engineer" },
          { type: "out", text: "> i build automation, apis, and intelligent workflows." },
          { type: "out", text: "> mostly awake at 3am debugging webhooks." },
          { type: "out", text: "" },
        ]); break;
      case "skills":
        push([
          { type: "out", text: "> languages   :: python, typescript, bash" },
          { type: "out", text: "> frameworks  :: fastapi, aiogram, pyrogram, playwright" },
          { type: "out", text: "> data        :: mongo, postgres, redis, sqlite" },
          { type: "out", text: "> infra       :: docker, nginx, systemd, cloudflare" },
          { type: "out", text: "> ai/ml       :: openai, gemini, langchain, embeddings" },
          { type: "out", text: "" },
        ]); break;
      case "stats":
        push([
          { type: "out", text: "> age       :: 18" },
          { type: "out", text: "> work      :: I/" },
          { type: "out", text: "> language  :: hindi / english" },
          { type: "out", text: "> country   :: india [ IN ]" },
          { type: "out", text: "> user id   :: @trgdm" },
          { type: "out", text: "" },
        ]); break;
      case "contact":
        push([
          { type: "out", text: "> opening secure channel :: telegram/@trgdm" },
          { type: "out", text: "> handshake ok. redirecting..." },
        ]);
        setTimeout(() => window.open("https://t.me/trgdm", "_blank", "noopener"), 400);
        break;
      case "sudo hire": case "sudo hire trgdm": case "hire":
        push([
          { type: "out", text: "> [sudo] authenticating intent........... OK" },
          { type: "out", text: "> availability :: OPEN" },
          { type: "out", text: "> preferred :: async, small teams, hard problems" },
          { type: "out", text: "> next step  :: run `contact`" },
          { type: "out", text: "" },
        ]); break;
      case "whoami":
        push([{ type: "out", text: "> guest@trgdm.sh" }, { type: "out", text: "" }]); break;
      case "ls":
        push([{ type: "out", text: "> about  skills  stats  contact  manifesto  README.md" }, { type: "out", text: "" }]); break;
      case "clear": setHistory(INITIAL); return;
      default:
        push([
          { type: "err", text: `command not found :: ${raw}` },
          { type: "err", text: "> try 'help'" },
          { type: "out", text: "" },
        ]);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    run(value);
    setPast((p) => [value, ...p]);
    setPi(-1);
    setValue("");
  };

  const onKey = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = Math.min(past.length - 1, pi + 1);
      if (n >= 0) { setPi(n); setValue(past[n]); }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = Math.max(-1, pi - 1);
      setPi(n); setValue(n === -1 ? "" : past[n]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = HELP.find((h) => h.cmd.startsWith(value.trim().toLowerCase()));
      if (match) setValue(match.cmd);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="edge-green hud-clip-lg bg-black/80 backdrop-blur-sm relative"
      data-testid="interactive-terminal"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-3 border-b border-green-500/25 px-5 py-3">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/80 shadow-[0_0_10px_#00ff41]" />
        <span className="ml-3 text-[10px] uppercase tracking-[0.3em] text-green-500/60">
          /bin/trgdm — bash — 120×40
        </span>
        <span className="ml-auto text-[10px] uppercase tracking-[0.3em] text-cyan-400/70">● live</span>
      </div>

      <div ref={bodyRef} className="px-5 sm:px-6 py-5 h-[420px] sm:h-[440px] overflow-y-auto font-mono text-[13px] sm:text-sm leading-relaxed">
        {history.map((h, i) => {
          if (h.type === "sys") return <div key={i} className="text-green-500/60">{h.text || "\u00A0"}</div>;
          if (h.type === "prompt")
            return (
              <div key={i} className="text-green-400">
                <span className="text-cyan-400">trgdm@sh</span>
                <span className="text-green-500/50">:</span>
                <span className="text-green-500/70">~</span>
                <span className="text-green-500/50">$</span>{" "}
                <span className="text-green-300 glow-green">{h.text}</span>
              </div>
            );
          if (h.type === "out") return <div key={i} className="text-green-400/90">{h.text || "\u00A0"}</div>;
          if (h.type === "err") return <div key={i} className="text-red-400">{h.text}</div>;
          if (h.type === "kv")
            return (
              <div key={i} className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-cyan-400">{h.k}</span>
                <span className="text-green-500/70">— {h.v}</span>
              </div>
            );
          return null;
        })}
        <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2">
          <span className="text-cyan-400">trgdm@sh</span>
          <span className="text-green-500/50">:</span>
          <span className="text-green-500/70">~</span>
          <span className="text-green-500/50">$</span>
          <input
            ref={inputRef} value={value}
            onChange={(e) => setValue(e.target.value)} onKeyDown={onKey}
            spellCheck={false} autoComplete="off"
            className="flex-1 bg-transparent text-green-300 caret-transparent"
            data-testid="terminal-input" aria-label="terminal input"
          />
          <span className="cursor-block" />
        </form>
      </div>

      <div className="border-t border-green-500/25 px-5 py-2 flex flex-wrap gap-x-5 gap-y-1 text-[10px] uppercase tracking-[0.28em] text-green-500/50">
        <span>[tab] autocomplete</span>
        <span>[↑↓] history</span>
        <span>[enter] execute</span>
        <span className="ml-auto text-cyan-400/70">try: about · skills · contact</span>
      </div>
    </motion.div>
  );
}