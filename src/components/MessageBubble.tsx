import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Copy, RotateCcw, User, Bot, Check } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { ChainOfThought } from "./ChainOfThought";
import { toast } from "sonner";
import { useState } from "react";

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 py-2 px-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

type Props = {
  message: ChatMessage;
  onRegenerate?: () => void;
};

export function MessageBubble({ message, onRegenerate }: Props) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1 ring-1 ring-primary/20">
          <Bot className="w-3.5 h-3.5 text-primary" />
        </div>
      )}

      <div className={`min-w-0 ${isUser ? "max-w-[75%]" : "max-w-[85%] flex-1"}`}>
        {!isUser && message.chainOfThought && message.chainOfThought.length > 0 && (
          <ChainOfThought steps={message.chainOfThought} />
        )}

        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-lg ml-auto"
            : "bg-card ring-1 ring-border/60 rounded-bl-lg shadow-sm"
        }`}>
          {message.isLoading && !message.content ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="chat-markdown overflow-hidden break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && message.content && !message.isLoading && (
          <div className="flex gap-0.5 mt-1.5 ml-1">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              title="Copy"
            >
              {copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                title="Regenerate"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center shrink-0 mt-1">
          <User className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      )}
    </motion.div>
  );
}
