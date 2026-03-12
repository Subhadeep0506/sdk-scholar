import { motion } from "framer-motion";
import { Check, Loader2, Search, Database, Brain, Sparkles, ChevronDown } from "lucide-react";
import { ChainOfThoughtStep } from "@/types/chat";
import { useState } from "react";

const stepIcons: Record<string, React.ElementType> = {
  analyze: Brain,
  retrieve: Database,
  websearch: Search,
  generate: Sparkles,
};

export function ChainOfThought({ steps }: { steps: ChainOfThoughtStep[] }) {
  const [expanded, setExpanded] = useState(true);
  const allDone = steps.every((s) => s.status === "done");
  const activeStep = steps.find((s) => s.status === "active");

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mb-3"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1.5 group"
      >
        <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "" : "-rotate-90"}`} />
        <span className="font-medium">
          {allDone ? "Reasoning complete" : activeStep ? activeStep.label + "..." : "Thinking..."}
        </span>
        {!allDone && (
          <Loader2 className="w-3 h-3 animate-spin" />
        )}
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl bg-muted/40 p-3"
        >
          {steps.map((step, i) => {
            const Icon = stepIcons[step.id] || Sparkles;
            const isLast = i === steps.length - 1;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-3"
              >
                {/* Timeline column */}
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ring-2 ${
                    step.status === "done"
                      ? "bg-accent/15 text-accent ring-accent/30"
                      : step.status === "active"
                      ? "bg-primary/15 text-primary ring-primary/30"
                      : "bg-muted text-muted-foreground/50 ring-border/50"
                  }`}>
                    {step.status === "done" ? (
                      <Check className="w-3 h-3" />
                    ) : step.status === "active" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Icon className="w-3 h-3" />
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 flex-1 min-h-[16px] transition-colors ${
                      step.status === "done" ? "bg-accent/30" : "bg-border/50"
                    }`} />
                  )}
                </div>
                {/* Content */}
                <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-3"}`}>
                  <p className={`text-xs font-medium pt-1 ${
                    step.status === "done"
                      ? "text-foreground/80"
                      : step.status === "active"
                      ? "text-foreground"
                      : "text-muted-foreground/60"
                  }`}>
                    {step.label}
                    {step.status === "done" && step.details && (
                      <span className="font-normal text-muted-foreground ml-1.5">— {step.details}</span>
                    )}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
