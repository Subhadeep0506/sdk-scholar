import { useState, useRef, useEffect } from "react";
import { Send, Globe, Settings, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  onSend: (content: string) => void;
  isLoading: boolean;
  webSearchEnabled: boolean;
  onToggleWebSearch: (enabled: boolean) => void;
  onOpenSettings: () => void;
};

export function ChatInput({ onSend, isLoading, webSearchEnabled, onToggleWebSearch, onOpenSettings }: Props) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  const canSend = input.trim() && !isLoading;

  return (
    <div className="p-3 sm:p-4 pb-4 sm:pb-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl bg-card ring-1 ring-border/60 shadow-lg shadow-background/50 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
          {/* Textarea */}
          <div className="px-4 pt-3 pb-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any AI SDK..."
              rows={1}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none scrollbar-thin leading-relaxed"
            />
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            <div className="flex items-center gap-1">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onToggleWebSearch(!webSearchEnabled)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        webSearchEnabled
                          ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {webSearchEnabled ? "Web search enabled" : "Enable web search"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onOpenSettings}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                canSend
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground/60 text-center mt-2.5">
          RAG Explorer uses retrieval-augmented generation. Responses may not always be accurate.
        </p>
      </div>
    </div>
  );
}
