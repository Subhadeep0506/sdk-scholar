import { useRef, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/hooks/useChatStore";
import { ChatSidebar } from "@/components/ChatSidebar";
import { MessageBubble } from "@/components/MessageBubble";
import { ChatInput } from "@/components/ChatInput";
import { SettingsDialog } from "@/components/SettingsDialog";
import { EmptyState } from "@/components/EmptyState";

export default function ChatPage() {
  const {
    sessions, activeSession, activeSessionId, settings,
    setActiveSessionId, newSession, deleteSession, renameSession, sendMessage, setSettings,
  } = useChatStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDark, setIsDark] = useState(settings.theme === "dark");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      setSettings({ ...settings, theme: next ? "dark" : "light" });
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession.messages]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSidebarOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isLoading = activeSession.messages.some((m) => m.isLoading);
  const hasMessages = activeSession.messages.length > 0;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={newSession}
        onDeleteSession={deleteSession}
        onRenameSession={renameSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => setSettingsOpen(true)}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - glass effect */}
        <header className="h-12 glass border-b border-border/40 flex items-center px-4 gap-3 shrink-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSidebarOpen((p) => !p)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold truncate">{activeSession.title}</h2>
            {activeSession.sdkFilter && (
              <span className="text-[11px] text-muted-foreground">Filtered: {activeSession.sdkFilter}</span>
            )}
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] text-muted-foreground/70 bg-muted/50 rounded-md border border-border/50 font-mono">
            ⌘K
          </kbd>
        </header>

        {/* Messages */}
        {hasMessages ? (
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
              {activeSession.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState onSelectQuery={sendMessage} />
        )}

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          webSearchEnabled={settings.webSearchEnabled}
          onToggleWebSearch={(enabled) => setSettings({ ...settings, webSearchEnabled: enabled })}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}
