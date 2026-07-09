"use client";

import { useState } from "react";
import { motion } from "motion/react";

type Plan = {
  planId: string;
  steps: { step: number; agentName: string; serviceName: string; fee: number }[];
  total: number;
};

type Execution = {
  executionId: string;
  status: "completed" | "partial" | "failed";
  stepResults: { step: number; agentName: string; status: string }[];
  totalPaid: number;
};

const SAMPLE_GOALS = [
  "token due diligence",
  "market brief",
  "honeypot check",
  "NFT collection",
];

export default function Home() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [execution, setExecution] = useState<Execution | null>(null);
  const [loading, setLoading] = useState<"plan" | "execute" | null>(null);

  const handleGeneratePlan = async () => {
    if (!goal.trim()) return;
    setLoading("plan");
    setExecution(null);
    try {
      const res = await fetch("https://bind-production-f593.up.railway.app/bind/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.trim() }),
      });
      const data = await res.json();
      setPlan({
        planId: data.plan.planId,
        steps: data.plan.steps.map((s: any) => ({
          step: s.step,
          agentName: s.agent.name,
          serviceName: s.agent.serviceName,
          fee: s.agent.feeAmount,
        })),
        total: data.plan.totalPriceUsdt,
      });
    } catch {
      /* demo */
    } finally {
      setLoading(null);
    }
  };

  const handleExecute = async () => {
    if (!plan) return;
    setLoading("execute");
    try {
      const res = await fetch("https://bind-production-f593.up.railway.app/bind/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.planId }),
      });
      const data = await res.json();
      setExecution({
        executionId: data.executionId || "-",
        status: data.status,
        stepResults: data.stepResults.map((r: any) => ({
          step: r.step,
          agentName: r.agentName,
          status: r.status === "passed" ? "passed" : "failed",
        })),
        totalPaid: data.totalPaid || plan.total,
      });
    } catch {
      /* demo */
    } finally {
      setLoading(null);
    }
  };

  const agents = [
    { name: "CertiK", cat: "Security", price: "0.001", color: "from-cyan to-blue-400" },
    { name: "Sentiment Oracle", cat: "Sentiment", price: "0.10", color: "from-violet-400 to-purple-500" },
    { name: "Predexon", cat: "Market Data", price: "0.01", color: "from-emerald-400 to-teal-500" },
    { name: "Fan Token Intel", cat: "Market Regime", price: "0.02", color: "from-amber-400 to-orange-500" },
  ];

  return (
    <main className="min-h-[100dvh]">
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-cyan/20 border border-cyan/30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan" />
          </div>
          <span className="text-sm font-medium text-ivory tracking-tight">Bind</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-ivory-muted">
          <a href="#how" className="hover:text-ivory transition-colors">How it works</a>
          <a href="#agents" className="hover:text-ivory transition-colors">Agents</a>
          <a
            href="https://github.com/jenzylove/bind"
            className="px-4 py-1.5 rounded-lg border border-navy-border text-ivory hover:border-cyan/30 hover:text-cyan transition-all"
          >
            Code
          </a>
        </nav>
      </header>

      <section className="px-6 pt-24 pb-20 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[11px] tracking-[3px] uppercase text-cyan mb-4">Multi-agent orchestration</p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-ivory">
                Hire the marketplace.
              </h1>
              <p className="text-lg text-ivory-muted leading-relaxed mt-5 max-w-md">
                One goal, multiple agents, sequential execution with verification
                gates between each step. Paid on X Layer, receipt on chain.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10"
            >
              <div className="bg-navy-light border border-navy-border rounded-xl px-5 py-3.5 transition-colors focus-within:border-cyan/20">
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="What do you want to get done?"
                  className="w-full bg-transparent border-none text-ivory text-base outline-none resize-none min-h-[48px] font-sans leading-relaxed placeholder:text-ivory-muted/30"
                  rows={1}
                />
              </div>
              <div className="flex gap-1.5 flex-wrap mt-3">
                {SAMPLE_GOALS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className="text-xs px-3 py-1 rounded-full border border-navy-border text-ivory-muted/60 hover:border-cyan/30 hover:text-cyan transition-all"
                  >
                    {g}
                  </button>
                ))}
              </div>
              <button
                onClick={handleGeneratePlan}
                disabled={!goal.trim() || loading === "plan"}
                className="w-full mt-4 py-3 rounded-xl bg-cyan text-navy font-semibold text-sm hover:bg-cyan/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading === "plan" ? "Planning..." : "Generate plan and quote"}
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="bg-navy-light border border-navy-border rounded-2xl p-6">
              <p className="text-[11px] tracking-[2px] uppercase text-ivory-muted/50 mb-5">Execution pipeline</p>
              <div className="space-y-3">
                {agents.map((a, i) => (
                  <div key={a.name}>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-navy/50 border border-navy-border/50">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${a.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ivory">{a.name}</p>
                        <p className="text-xs text-ivory-muted/60">{a.cat}</p>
                      </div>
                      <p className="text-xs font-mono text-ivory-muted">{a.price} USDT</p>
                    </div>
                    {i < agents.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-navy-border">
                          <path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-navy-border/50 flex items-center justify-between">
                <p className="text-xs text-ivory-muted/50">Verification gate between each step</p>
                <p className="text-xs font-mono text-cyan">~0.131 USDT total</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {plan && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="px-6 pb-32 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-between bg-navy-light border border-navy-border rounded-xl px-5 py-4 mb-6">
            <div>
              <p className="text-xs text-ivory-muted">Estimated total</p>
              <p className="text-3xl font-semibold text-cyan tracking-tight mt-0.5">
                {plan.total.toFixed(3)}{" "}
                <span className="text-sm font-normal text-ivory-muted">USDT</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ivory-muted">{plan.steps.length} agents</p>
              <p className="text-xs text-cyan/70 mt-0.5">verification gates active</p>
            </div>
          </div>

          <div className="space-y-1.5">
            {plan.steps.map((step, i) => (
              <div key={step.step}>
                <div className="flex items-center gap-4 bg-navy-light border border-navy-border rounded-lg px-4 py-3.5 hover:border-cyan/10 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-navy-border flex items-center justify-center text-xs font-semibold text-ivory-muted shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ivory">{step.agentName}</p>
                    <p className="text-xs text-ivory-muted truncate">{step.serviceName}</p>
                  </div>
                  <p className="text-sm font-medium text-cyan">{step.fee.toFixed(3)}</p>
                </div>
                {i < plan.steps.length - 1 && (
                  <div className="flex justify-center py-1 gap-2 items-center">
                    <span className="text-[10px] uppercase tracking-wider text-ivory-muted/30">verify</span>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-navy-border">
                      <path d="M4 0v8M2 6l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!execution && (
            <button
              onClick={handleExecute}
              disabled={loading === "execute"}
              className="w-full mt-6 py-3.5 rounded-xl bg-cyan text-navy font-semibold text-sm hover:bg-cyan/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading === "execute" ? "Executing, paying agents sequentially..." : "Execute and pay agents"}
            </button>
          )}

          {execution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8 bg-navy-light border border-navy-border rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-navy-border">
                <p className="text-sm font-medium text-ivory">Execution complete</p>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-dim text-cyan border border-cyan-border">
                  {execution.stepResults.filter(r => r.status === "passed").length}/{execution.stepResults.length} passed
                </span>
              </div>
              {execution.stepResults.map((sr) => (
                <div key={sr.step} className="flex items-center justify-between px-5 py-3 border-b border-navy-border/50 last:border-b-0">
                  <p className="text-sm text-ivory/80">{sr.agentName}</p>
                  <span className={sr.status === "passed" ? "text-cyan" : "text-red-400"}>
                    {sr.status === "passed" ? "verified" : "failed"}
                  </span>
                </div>
              ))}
              <div className="px-5 py-3 bg-navy/50 flex items-center justify-between text-xs text-ivory-muted">
                <span>{execution.executionId.slice(0, 8)}</span>
                <span>{execution.totalPaid.toFixed(3)} USDT settled</span>
              </div>
            </motion.div>
          )}
        </motion.section>
      )}

      <section id="how" className="px-6 py-24 max-w-6xl mx-auto border-t border-navy-border/30">
        <div className="max-w-2xl">
          <p className="text-[11px] tracking-[3px] uppercase text-cyan mb-4">How it works</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] tracking-tight text-ivory">
            You describe the outcome. Bind executes the process.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            { n: "01", t: "Plan", d: "Bind breaks your goal into a multi-agent workflow with a single flat price. No per-agent negotiation, no hidden fees." },
            { n: "02", t: "Execute", d: "Pays each agent on X Layer via x402, verifies every output before the next payment, routes around failures." },
            { n: "03", t: "Deliver", d: "Bundles all verified outputs into one deliverable with an on-chain receipt. Three agents, one outcome." },
          ].map((s) => (
            <div key={s.n} className="border border-navy-border rounded-xl p-6 hover:border-cyan/10 transition-colors">
              <p className="text-[11px] tracking-[3px] uppercase text-ivory-muted/40 mb-2">{s.n}</p>
              <p className="text-lg font-medium text-ivory mb-2">{s.t}</p>
              <p className="text-sm text-ivory-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="agents" className="px-6 py-24 max-w-6xl mx-auto border-t border-navy-border/30">
        <p className="text-[11px] tracking-[3px] uppercase text-cyan mb-4">Agent catalog</p>
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] tracking-tight text-ivory mb-10">
          Real agents, real endpoints, live on the marketplace.
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {agents.map((a) => (
            <div key={a.name} className="flex items-center gap-4 bg-navy-light border border-navy-border rounded-lg p-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center text-navy font-bold text-sm`}>
                {a.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ivory">{a.name}</p>
                <p className="text-xs text-ivory-muted">{a.cat}</p>
              </div>
              <p className="text-sm font-mono text-cyan">{a.price} USDT</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-ivory-muted/30 py-8 border-t border-navy-border/30">
        Built for the OKX AI Genesis Hackathon
      </footer>
    </main>
  );
}