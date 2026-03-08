import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { SUGGESTED_QUERIES } from "@/types/chat";

type Props = {
  onSelectQuery: (query: string) => void;
};

export function EmptyState({ onSelectQuery }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">What can I help you explore?</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            Ask anything about agentic AI & generative AI SDKs. Powered by retrieval-augmented generation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SUGGESTED_QUERIES.map((query, i) => (
            <motion.button
              key={query}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04, duration: 0.35 }}
              onClick={() => onSelectQuery(query)}
              className="group text-left p-3.5 rounded-xl bg-card ring-1 ring-border/50 hover:ring-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all text-sm text-foreground flex items-center justify-between gap-3"
            >
              <span className="line-clamp-2">{query}</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
