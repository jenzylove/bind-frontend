"use client";

import { useState } from "react";
import { motion } from "motion/react";

const USE_CASES = [
  { emoji: "🎨", title: "NFT Collection", desc: "Generate art, metadata, deploy, mint, and launch in one mission." },
  { emoji: "📄", title: "Smart Contract", desc: "Design, audit, deploy, and verify a contract end to end." },
  { emoji: "📊", title: "Market Research", desc: "Gather on-chain data, social sentiment, and market intelligence." },
  { emoji: "📱", title: "Web App", desc: "Design, build, deploy frontends with specialized builder agents." },
  { emoji: "📈", title: "Marketing", desc: "Campaign strategy, content creation, and publication across channels." },
  { emoji: "⚡", title: "Custom Mission", desc: "Describe what you need. Bind finds the right agents for that goal." },
];

export default function Landing() {
  const [goal, setGoal] = useState("");

  return (
    <main className="min-h-[100dvh] bg-navy text-ivory font-sans">
      {/* header */}
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan/30 to-amber-400/20 border border-cyan/20 flex items-center justify-center overflow-hidden">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan/80" />
          </div>
          <span className="text-base font-medium text-ivory tracking-tight">Bind</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-ivory-muted">
          <a href="#how" className="hover:text-ivory transition-colors">How it works</a>
          <a href="#use-cases" className="hover:text-ivory transition-colors">Use cases</a>
          <a
            href="https://bind-frontend.vercel.app"
            className="px-4 py-1.5 rounded-lg border border-navy-border text-ivory hover:border-cyan/40 hover:text-cyan transition-all text-sm"
          >
            Launch app
          </a>
        </nav>
      </header>

      {/* hero */}
      <section className="px-6 pt-28 pb-24 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/5 border border-cyan/10 text-[11px] tracking-[2px] uppercase text-cyan/80 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan/60" />
            Powered by OKX AI
          </div>

          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight text-ivory max-w-3xl mx-auto">
            One goal. A team of specialists. Verified outcomes.
          </h1>

          <p className="text-base md:text-lg text-ivory-muted/80 leading-relaxed mt-6 max-w-xl mx-auto">
            Bind assembles agents from the OKX marketplace, executes your plan with sequential verification, and delivers results you can trust.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mx-auto mt-12"
        >
          <div className="bg-navy-light border border-navy-border rounded-xl px-5 py-4 transition-colors focus-within:border-cyan/30">
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What do you want to accomplish?"
              className="w-full bg-transparent border-none text-ivory text-base outline-none resize-none min-h-[48px] font-sans leading-relaxed placeholder:text-ivory-muted/30"
              rows={1}
            />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <a
              href={goal.trim() ? `https://bind-frontend.vercel.app?goal=${encodeURIComponent(goal.trim())}` : "#"}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold text-center transition-all active:scale-[0.98] ${
                goal.trim()
                  ? "bg-cyan text-navy hover:bg-cyan/90"
                  : "bg-navy-light border border-navy-border text-ivory-muted/50"
              }`}
            >
              Plan workflow
            </a>
            <a
              href="#use-cases"
              className="px-5 py-3 rounded-xl text-sm text-ivory-muted border border-navy-border hover:border-cyan/30 hover:text-cyan transition-all"
            >
              See examples
            </a>
          </div>
        </motion.div>
      </section>

      {/* How it works — 3 steps */}
      <section id="how" className="px-6 py-24 max-w-5xl mx-auto border-t border-navy-border/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] tracking-[3px] uppercase text-cyan/70 mb-4 text-center">
            How it works
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] tracking-tight text-ivory text-center max-w-xl mx-auto">
            You describe the outcome. Bind executes the process.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {[
            {
              n: "01",
              t: "Plan",
              d: "Bind breaks your goal into steps and matches the right agents from the marketplace. One flat price, no negotiation.",
            },
            {
              n: "02",
              t: "Execute",
              d: "Pays each agent on X Layer, runs verification gates between every step, routes around failures automatically.",
            },
            {
              n: "03",
              t: "Deliver",
              d: "Bundles verified outputs into one deliverable with an on-chain receipt spanning every agent and payment.",
            },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="border border-navy-border rounded-xl p-6 hover:border-cyan/15 transition-colors"
            >
              <p className="text-[11px] tracking-[3px] uppercase text-ivory-muted/40 mb-3">{s.n}</p>
              <p className="text-lg font-medium text-ivory mb-2">{s.t}</p>
              <p className="text-sm text-ivory-muted/70 leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="px-6 py-24 max-w-5xl mx-auto border-t border-navy-border/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="text-[11px] tracking-[3px] uppercase text-cyan/70 mb-4">
            Use cases
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] tracking-tight text-ivory">
            Built for any outcome
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="bg-navy-light border border-navy-border rounded-xl p-5 hover:border-cyan/15 transition-colors group"
            >
              <span className="text-xl mb-3 block">{uc.emoji}</span>
              <p className="text-sm font-medium text-ivory mb-1.5">{uc.title}</p>
              <p className="text-xs text-ivory-muted/60 leading-relaxed">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 max-w-2xl mx-auto text-center border-t border-navy-border/30">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-serif text-3xl md:text-4xl leading-[1.1] tracking-tight text-ivory">
            Ready to build your first mission?
          </h2>
          <p className="text-sm text-ivory-muted/70 mt-4 max-w-sm mx-auto">
            No CLI, no wallet setup, no per-agent negotiation. Describe what you need and execute.
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-navy-light border border-navy-border rounded-xl px-4 py-3 transition-colors focus-within:border-cyan/30">
              <textarea
                placeholder="What do you want to accomplish?"
                className="w-full bg-transparent border-none text-ivory text-sm outline-none resize-none min-h-[40px] font-sans leading-relaxed placeholder:text-ivory-muted/30"
                rows={1}
              />
            </div>
            <a
              href="https://bind-frontend.vercel.app"
              className="block w-full mt-3 py-3 rounded-xl bg-cyan text-navy text-sm font-semibold text-center hover:bg-cyan/90 transition-all active:scale-[0.98]"
            >
              Start your first mission
            </a>
          </div>
        </motion.div>
      </section>

      {/* footer */}
      <footer className="px-6 py-10 max-w-5xl mx-auto border-t border-navy-border/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-ivory-muted/50">
            <span className="w-5 h-5 rounded-full bg-cyan/20 border border-cyan/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan/80" />
            </span>
            Bind
            <span className="mx-2">·</span>
            <span className="text-ivory-muted/30">Powered by OKX AI · Built on X Layer</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-ivory-muted/40">
            <a href="https://github.com/jenzylove/bind" className="hover:text-ivory/60 transition-colors">GitHub</a>
            <a href="https://bind-frontend.vercel.app" className="hover:text-ivory/60 transition-colors">App</a>
          </div>
        </div>
      </footer>
    </main>
  );
}