import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, ArrowRight, Search, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="h-16 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Cpu className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">RAG Explorer</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered SDK Documentation Assistant
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Explore SDK documentation with{" "}
            <span className="text-primary">intelligent retrieval</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Ask questions about agentic AI frameworks and get accurate, context-aware answers 
            powered by retrieval-augmented generation.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register">
                Start Exploring
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-3xl w-full"
        >
          {[
            { icon: Search, title: "Smart Retrieval", desc: "Finds the most relevant documentation chunks for your query." },
            { icon: BookOpen, title: "Multi-SDK Support", desc: "Ask about LangChain, LlamaIndex, CrewAI, and more in one place." },
            { icon: Zap, title: "Chain of Thought", desc: "See exactly how your answer is being constructed, step by step." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl bg-card p-5 text-left shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <f.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="h-14 border-t border-border/40 flex items-center justify-center text-xs text-muted-foreground">
        © 2026 RAG Explorer. Built with Lovable.
      </footer>
    </div>
  );
}
