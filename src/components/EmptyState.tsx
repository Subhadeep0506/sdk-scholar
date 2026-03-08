import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SUGGESTED_QUERIES } from "@/types/chat";

type Props = {
  onSelectQuery: (query: string) => void;
};

export function EmptyState({ onSelectQuery }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">RAG Explorer</h2>
          <p className="text-muted-foreground mb-8">
            Ask anything about agentic AI & generative AI SDKs. Powered by retrieval-augmented generation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUGGESTED_QUERIES.map((query, i) => (
            <motion.button
              key={query}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => onSelectQuery(query)}
              className="text-left p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 hover:border-primary/30 transition-all text-sm text-foreground"
            >
              {query}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
