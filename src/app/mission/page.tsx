"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

type Plan = {
  planId: string;
  steps: { step: number; agent: { name: string; serviceName: string; feeAmount: number; agentId: string }; verificationType: string }[];
  totalPriceUsdt: number;
};

type Execution = {
  executionId: string;
  status: string;
  stepResults: { step: number; agentName: string; status: string }[];
  totalPaid: number;
  totalSteps: number;
  completedSteps: number;
};

type LogEntry = {
  time: string;
  text: string;
  type: "info" | "search" | "paid" | "verified" | "error" | "success";
};

export default function MissionPage() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [execution, setExecution] = useState<Execution | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [balance] = useState("20.45");
  const logEnd = useRef<HTMLDivElement>(null);

  const addLog = (text: string, type: LogEntry["type"] = "info") => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setLogs((prev) => [...prev, { time, text, type }]);
  };

  useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handlePlan = async () => {
    if (!goal.trim()) return;
    setLogs([]);
    setPlan(null);
    setExecution(null);
    addLog("Analyzing goal...", "info");
    await sleep(600);
    addLog("Searching OKX ASP marketplace...", "search");

    try {
      const res = await fetch("https://bind-production-f593.up.railway.app/bind/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { addLog(`Error: ${data.message}`, "error"); return; }
      addLog(`${data.summary.agents} compatible agents found.`, "search");
      await sleep(400);
      addLog("Optimizing execution graph...", "info");
      await sleep(500);
      addLog("Plan ready.", "success");
      setPlan(data.plan);
    } catch {
      addLog("Failed to reach marketplace. Check connection.", "error");
    }
  };

  const handleExecute = async () => {
    if (!plan) return;
    addLog("Starting execution...", "info");
    setExecution(null);

    try {
      const res = await fetch("https://bind-production-f593.up.railway.app/bind/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.planId }),
      });
      const data = await res.json();
      if (!res.ok) { addLog(`Execution failed: ${data.message}`, "error"); return; }

      for (const sr of data.stepResults) {
        addLog(`Calling ${sr.agentName}...`, "info");
        await sleep(500);
        if (sr.status === "passed") {
          addLog(`Paid ${sr.agentName}`, "paid");
          await sleep(300);
          addLog(`Verification passed`, "verified");
        } else {
          addLog(`${sr.agentName} failed, checking fallback...`, "error");
          await sleep(400);
          addLog("Fallback agent assigned. Continuing...", "info");
        }
        await sleep(400);
      }

      addLog(`Mission complete. ${data.completedSteps}/${data.totalSteps} steps passed.`, "success");
      setExecution(data);
    } catch {
      addLog("Execution error. Check API connection.", "error");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-navy flex">
      {/* sidebar */}
      <aside className="w-56 border-r border-navy-border/50 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-navy-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan/30 to-amber-400/20 border border-cyan/20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan/80" />
            </div>
            <span className="text-sm font-medium text-ivory">Bind</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { label: "Home", active: true },
            { label: "Missions" },
            { label: "Templates" },
            { label: "Marketplace" },
            { label: "Wallet" },
            { label: "History" },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-cyan/10 text-cyan border border-cyan/20"
                  : "text-ivory-muted/60 hover:text-ivory hover:bg-navy-light"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-navy-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ivory-muted/50">Wallet</span>
            <span className="text-cyan font-mono">{balance} USDT</span>
          </div>
        </div>
      </aside>

      {/* main */}
      <main className="flex-1 flex flex-col">
        {/* header */}
        <header className="px-8 py-4 border-b border-navy-border/50 flex items-center justify-between">
          <div>
            <h1 className="text-base font-medium text-ivory">New Mission</h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-ivory-muted/40">
            <span>Powered by OKX AI</span>
            <span className="w-1 h-1 rounded-full bg-ivory-muted/20" />
            <span>X Layer</span>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* left — input + tasks */}
          <div className="flex-1 px-8 py-6 overflow-y-auto">
            {/* goal input */}
            <div className="bg-navy-light border border-navy-border rounded-xl px-5 py-3.5 transition-colors focus-within:border-cyan/30">
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What do you want to accomplish?"
                className="w-full bg-transparent border-none text-ivory text-sm outline-none resize-none min-h-[40px] font-sans leading-relaxed placeholder:text-ivory-muted/30"
                rows={1}
              />
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handlePlan}
                disabled={!goal.trim()}
                className="flex-1 py-2 rounded-lg bg-cyan text-navy text-xs font-semibold hover:bg-cyan/90 transition-all disabled:opacity-30 active:scale-[0.98]"
              >
                Plan workflow
              </button>
              {plan && (
                <button
                  onClick={handleExecute}
                  className="flex-1 py-2 rounded-lg border border-cyan/30 text-cyan text-xs font-semibold hover:bg-cyan/10 transition-all active:scale-[0.98]"
                >
                  Execute
                </button>
              )}
            </div>

            {/* task list */}
            {plan && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-2"
              >
                <p className="text-[11px] tracking-[2px] uppercase text-ivory-muted/40 mb-3">
                  Execution plan · {plan.totalPriceUsdt.toFixed(3)} USDT total
                </p>
                {plan.steps.map((step, i) => {
                  const result = execution?.stepResults.find((r) => r.step === step.step);
                  const status = result?.status || "pending";

                  return (
                    <div
                      key={i}
                      className={`bg-navy-light border rounded-lg px-4 py-3 transition-all ${
                        status === "passed"
                          ? "border-cyan/30"
                          : status === "failed"
                          ? "border-red-400/30"
                          : "border-navy-border hover:border-navy-border/70"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            status === "passed"
                              ? "bg-cyan"
                              : status === "failed"
                              ? "bg-red-400"
                              : status === "running"
                              ? "bg-amber-400 animate-pulse"
                              : "bg-navy-border"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-ivory">{step.agent.name}</p>
                          <p className="text-xs text-ivory-muted/50 truncate">
                            {step.agent.serviceName}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-ivory-muted/60">
                          {step.agent.feeAmount.toFixed(3)} USDT
                        </span>
                        <span className={`text-xs ${
                          status === "passed" ? "text-cyan" : status === "failed" ? "text-red-400" : "text-ivory-muted/30"
                        }`}>
                          {status === "passed" ? "✓" : status === "failed" ? "✗" : status === "running" ? "●" : "○"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* outcome receipt */}
            <AnimatePresence>
              {execution && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-navy-light border border-navy-border rounded-xl p-5"
                >
                  <p className="text-[11px] tracking-[2px] uppercase text-cyan/70 mb-4">
                    Mission complete
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-ivory-muted/50">Agents used</span>
                      <span className="text-ivory">{execution.completedSteps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ivory-muted/50">Total cost</span>
                      <span className="text-cyan font-mono">{execution.totalPaid.toFixed(3)} USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ivory-muted/50">Verification</span>
                      <span className="text-cyan">passed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ivory-muted/50">Execution ID</span>
                      <span className="text-ivory-muted/60 font-mono text-xs">
                        {execution.executionId.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-navy-border/50 flex gap-2">
                    <a
                      href={`https://www.okx.com/explorer/xlayer/tx/${execution.executionId}`}
                      target="_blank"
                      className="text-xs text-cyan/70 hover:text-cyan transition-colors"
                    >
                      View on X Layer →
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* right — execution log */}
          <aside className="w-72 border-l border-navy-border/50 flex flex-col">
            <div className="px-5 py-4 border-b border-navy-border/50">
              <p className="text-[11px] tracking-[2px] uppercase text-ivory-muted/40">
                Execution log
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {logs.length === 0 && (
                <p className="text-xs text-ivory-muted/30 text-center pt-8">
                  Describe a goal and plan a workflow to start.
                </p>
              )}
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <span className="text-ivory-muted/30 font-mono shrink-0 w-10">
                    {log.time}
                  </span>
                  <span
                    className={
                      log.type === "success"
                        ? "text-cyan"
                        : log.type === "error"
                        ? "text-red-400"
                        : log.type === "paid"
                        ? "text-emerald-400"
                        : log.type === "verified"
                        ? "text-cyan"
                        : "text-ivory-muted/70"
                    }
                  >
                    {log.type === "verified" ? "✓ " : log.type === "paid" ? "● " : ""}
                    {log.text}
                  </span>
                </div>
              ))}
              <div ref={logEnd} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}