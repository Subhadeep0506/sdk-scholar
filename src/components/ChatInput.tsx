import { useState, useRef, useEffect } from "react";
import { Send, Globe, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AppSettings } from "@/types/chat";

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

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Globe className={`w-4 h-4 ${webSearchEnabled ? "text-accent" : "text-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground">Web Search</span>
            <Switch
              checked={webSearchEnabled}
              onCheckedChange={onToggleWebSearch}
              className="scale-75"
            />
          </div>
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-auto"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any AI SDK..."
              rows={1}
              className="w-full resize-none rounded-xl border border-input bg-card px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring scrollbar-thin"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="rounded-xl h-11 w-11 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          RAG Explorer uses retrieval-augmented generation. Responses may not always be accurate.
        </p>
      </div>
    </div>
  );
}
