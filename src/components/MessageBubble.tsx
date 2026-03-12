import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, RotateCcw, User, Bot, Check, ThumbsUp, ThumbsDown,
  MessageSquare, Globe, Coins, ExternalLink,
} from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { ChainOfThought } from "./ChainOfThought";
import { CodeBlock } from "./CodeBlock";
import { FeedbackDialog } from "./FeedbackDialog";
import { toast } from "sonner";
import { useState, useRef } from "react";
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  message: ChatMessage;
  onRegenerate?: () => void;
};

export function MessageBubble({ message, onRegenerate }: Props) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(message.liked ?? null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked((prev) => (prev === true ? null : true));
  };

  const handleDislike = () => {
    setLiked((prev) => (prev === false ? null : false));
  };

  const tokenUsage = message.tokenUsage;
  const sources = message.sources;

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
            : "bg-card rounded-bl-lg shadow-sm"
        }`}>
          {message.isLoading && !message.content ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="chat-markdown overflow-hidden break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre({ children, ...props }) {
                    // Extract code string from children
                    const codeChild = (children as any)?.props;
                    const codeString = codeChild?.children || "";
                    return (
                      <CodeBlock className={codeChild?.className}>
                        {typeof codeString === "string" ? codeString : String(codeString)}
                      </CodeBlock>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action buttons for AI messages */}
        {!isUser && message.content && !message.isLoading && (
          <div className="flex items-center gap-0.5 mt-1.5 ml-1 flex-wrap">
            {/* Sources */}
            {sources && sources.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all flex items-center gap-1"
                    title="Sources"
                  >
                    <Globe className="w-3 h-3" />
                    <span className="text-[10px] font-medium">Sources</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3" side="top" align="start">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground mb-2">Sources used</p>
                    {sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 hover:bg-muted/50 rounded-md px-2 py-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Like */}
            <button
              onClick={handleLike}
              className={`p-1.5 rounded-lg transition-all ${
                liked === true
                  ? "text-accent bg-accent/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Like"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>

            {/* Dislike */}
            <button
              onClick={handleDislike}
              className={`p-1.5 rounded-lg transition-all ${
                liked === false
                  ? "text-destructive bg-destructive/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Dislike"
            >
              <ThumbsDown className="w-3 h-3" />
            </button>

            {/* Feedback */}
            <button
              onClick={() => setFeedbackOpen(true)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              title="Feedback"
            >
              <MessageSquare className="w-3 h-3" />
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              title="Copy"
            >
              {copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
            </button>

            {/* Regenerate */}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                title="Regenerate"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}

            {/* Token Usage */}
            {tokenUsage && (
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <button
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all flex items-center gap-1"
                    title="Token usage"
                  >
                    <Coins className="w-3 h-3" />
                    <span className="text-[10px] font-medium">{tokenUsage.totalTokens}</span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-48 p-3" side="top" align="start">
                  <p className="text-xs font-semibold text-foreground mb-2">Token Usage</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prompt</span>
                      <span className="font-mono font-medium">{tokenUsage.promptTokens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-mono font-medium">{tokenUsage.completionTokens}</span>
                    </div>
                    <div className="border-t border-border pt-1.5 flex justify-between font-medium">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-mono">{tokenUsage.totalTokens}</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center shrink-0 mt-1">
          <User className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      )}

      {/* Feedback dialog */}
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        messageId={message.id}
      />
    </motion.div>
  );
}

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
