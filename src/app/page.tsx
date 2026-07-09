"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type PlanStep = {
  step: number;
  agentName: string;
  serviceName: string;
  fee: number;
};

type Plan = {
  planId: string;
  steps: PlanStep[];
  total: number;
  estimatedTime: string;
};

type StepResult = {
  step: number;
  agentName: string;
  status: "passed" | "failed" | "running";
};

type Execution = {
  executionId: string;
  status: "completed" | "partial" | "failed";
  stepResults: StepResult[];
  totalPaid: number;
};

const SAMPLE_GOALS = [
  "token due diligence",
  "market brief",
  "honeypot check",
  "NFT collection analysis",
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
        estimatedTime: data.plan.estimatedTime,
      });
    } catch {
      // silently fail — demo mode
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
          status: r.status === "passed" ? "passed" : r.status === "failed" ? "failed" : "passed",
        })),
        totalPaid: data.totalPaid || plan.total,
      });
    } catch {
      // silently fail
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-[100dvh] flex flex-col">
      {/* header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <span className="text-[11px] tracking-[3px] uppercase text-ivory-muted">
          Bind
        </span>
      </header>

      {/* hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pb-24 pt-12 max-w-2xl mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-ivory text-center"
        >
          What are you building?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-ivory-muted text-base md:text-lg text-center leading-relaxed max-w-lg"
        >
          Describe what you need done. Bind finds agents on the marketplace, pays
          them on X Layer, checks their work, and delivers the result.
        </motion.p>

        {/* input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-10"
        >
          <div className="bg-navy-light border border-navy-border rounded-xl px-5 py-4 transition-colors focus-within:border-cyan/20">
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Is token 0x1234 safe to buy?"
              className="w-full bg-transparent border-none text-ivory text-lg outline-none resize-none min-h-[56px] font-sans leading-relaxed placeholder:text-ivory-muted/30"
              rows={2}
            />
          </div>
        </motion.div>

        {/* prompt chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-2 flex-wrap mt-4 w-full"
        >
          {SAMPLE_GOALS.map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className="text-sm px-3.5 py-1.5 rounded-full border border-navy-border text-ivory-muted/70 hover:border-cyan/30 hover:text-cyan transition-all"
            >
              {g}
            </button>
          ))}
        </motion.div>

        {/* generate button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 w-full"
        >
          <button
            onClick={handleGeneratePlan}
            disabled={!goal.trim() || loading === "plan"}
            className="w-full py-3.5 rounded-xl bg-cyan text-navy font-semibold text-base hover:bg-cyan/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading === "plan" ? "Planning..." : "Generate Plan"}
          </button>
        </motion.div>
      </section>

      {/* plan + result */}
      <AnimatePresence>
        {plan && (
          <motion.section
            key="plan"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="px-6 pb-32 max-w-2xl mx-auto w-full"
          >
            {/* price bar */}
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
                <p className="text-xs text-cyan/70 mt-0.5">{plan.estimatedTime}</p>
              </div>
            </div>

            {/* pipeline */}
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
                    <div className="flex justify-center py-0.5 text-navy-border text-sm">↓</div>
                  )}
                </div>
              ))}
            </div>

            {/* execute button */}
            {!execution && (
              <button
                onClick={handleExecute}
                disabled={loading === "execute"}
                className="w-full mt-6 py-3.5 rounded-xl bg-cyan text-navy font-semibold text-base hover:bg-cyan/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading === "execute" ? "Executing..." : "Execute Plan"}
              </button>
            )}

            {/* execution result */}
            <AnimatePresence>
              {execution && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 bg-navy-light border border-navy-border rounded-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-navy-border">
                    <p className="text-sm font-medium text-ivory">
                      {execution.status === "completed"
                        ? "Workflow complete"
                        : execution.status === "partial"
                        ? "Partial completion"
                        : "Failed"}
                    </p>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-dim text-cyan border border-cyan-border">
                      {execution.status}
                    </span>
                  </div>
                  {execution.stepResults.map((sr) => (
                    <div
                      key={sr.step}
                      className="flex items-center justify-between px-5 py-3 border-b border-navy-border/50 last:border-b-0"
                    >
                      <p className="text-sm text-ivory/80">{sr.agentName}</p>
                      <span
                        className={
                          sr.status === "passed" ? "text-cyan" : "text-red-400"
                        }
                      >
                        {sr.status === "passed" ? "✓" : "✗"}
                      </span>
                    </div>
                  ))}
                  <div className="px-5 py-3 bg-navy/50 flex items-center justify-between text-xs text-ivory-muted">
                    <span>Execution {execution.executionId.slice(0, 8)}</span>
                    <span>{execution.totalPaid.toFixed(3)} USDT</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>

      {/* footer */}
      <footer className="text-center text-xs text-ivory-muted/40 py-6">
        Built for the OKX AI Genesis Hackathon
      </footer>
    </main>
  );
}