import { motion } from "framer-motion";
import { Check, Loader2, Search, Database, Brain, Sparkles } from "lucide-react";
import { ChainOfThoughtStep } from "@/types/chat";

const stepIcons: Record<string, React.ElementType> = {
  analyze: Brain,
  retrieve: Database,
  websearch: Search,
  generate: Sparkles,
};

export function ChainOfThought({ steps }: { steps: ChainOfThoughtStep[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="bg-cot-bg border border-cot-border rounded-lg p-3 mb-3 space-y-2"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Chain of Thought
      </p>
      {steps.map((step, i) => {
        const Icon = stepIcons[step.id] || Sparkles;
        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              step.status === "done"
                ? "bg-cot-done/20 text-cot-done"
                : step.status === "active"
                ? "bg-cot-active/20 text-cot-active"
                : "bg-muted text-muted-foreground"
            }`}>
              {step.status === "done" ? (
                <Check className="w-3.5 h-3.5" />
              ) : step.status === "active" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                step.status === "done"
                  ? "text-cot-done"
                  : step.status === "active"
                  ? "text-cot-active"
                  : "text-muted-foreground"
              }`}>
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {step.status === "done" && step.details ? step.details : step.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
