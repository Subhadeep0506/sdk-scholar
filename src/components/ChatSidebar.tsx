import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, Trash2, Edit3, ChevronDown, Cpu, X, Settings, LogOut, User, Moon, Sun } from "lucide-react";
import { ChatSession, SDK_LIST } from "@/types/chat";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Props = {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: (sdkFilter?: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, title: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
};

export function ChatSidebar({
  sessions, activeSessionId, onSelectSession, onNewSession,
  onDeleteSession, onRenameSession, isOpen, onClose, onOpenSettings, onToggleTheme, isDark,
}: Props) {
  const [sdkDialogOpen, setSdkDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border z-50 flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h1 className="font-bold text-lg text-sidebar-foreground">RAG Explorer</h1>
                  <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Chat
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem onClick={() => onNewSession()}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      New Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSdkDialogOpen(true)}>
                      <Cpu className="w-4 h-4 mr-2" />
                      New Chat with SDK...
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
                {sessions.map((session) => (
                  <motion.div
                    key={session.id}
                    layout
                    className={`group flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                      session.id === activeSessionId
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                    onClick={() => { onSelectSession(session.id); onClose(); }}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      {editingId === session.id ? (
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleRename(session.id)}
                          onKeyDown={(e) => e.key === "Enter" && handleRename(session.id)}
                          className="h-6 text-sm px-1 bg-background"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <p className="text-sm font-medium truncate">{session.title}</p>
                          {session.sdkFilter && (
                            <span className="text-xs text-muted-foreground">{session.sdkFilter}</span>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1 rounded hover:bg-background/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(session.id);
                          setEditTitle(session.title);
                        }}
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-destructive/20 text-destructive"
                        onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-sidebar-border">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 w-full rounded-lg px-2 py-1.5 hover:bg-sidebar-accent/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">U</span>
                      </div>
                      <div className="text-sm text-left">
                        <p className="font-medium text-sidebar-foreground">User</p>
                        <p className="text-xs text-muted-foreground">Free Plan</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-56">
                    <DropdownMenuItem onClick={onOpenSettings}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onToggleTheme}>
                      {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                      {isDark ? "Light Mode" : "Dark Mode"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar - toggleable */}
      {isOpen && (
        <aside className="hidden w-72 bg-sidebar border-r border-sidebar-border lg:flex flex-col shrink-0 transition-all duration-300">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-lg text-sidebar-foreground">RAG Explorer</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Chat
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem onClick={() => onNewSession()}>
                <MessageSquare className="w-4 h-4 mr-2" />
                New Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSdkDialogOpen(true)}>
                <Cpu className="w-4 h-4 mr-2" />
                New Chat with SDK...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                session.id === activeSessionId
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <MessageSquare className="w-4 h-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                {editingId === session.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleRename(session.id)}
                    onKeyDown={(e) => e.key === "Enter" && handleRename(session.id)}
                    className="h-6 text-sm px-1"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <p className="text-sm font-medium truncate">{session.title}</p>
                    {session.sdkFilter && (
                      <span className="text-xs text-muted-foreground">{session.sdkFilter}</span>
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1 rounded hover:bg-background/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(session.id);
                    setEditTitle(session.title);
                  }}
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  className="p-1 rounded hover:bg-destructive/20 text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full rounded-lg px-2 py-1.5 hover:bg-sidebar-accent/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">U</span>
                </div>
                <div className="text-sm text-left">
                  <p className="font-medium text-sidebar-foreground">User</p>
                  <p className="text-xs text-muted-foreground">Free Plan</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuItem onClick={onOpenSettings}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleTheme}>
                {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                {isDark ? "Light Mode" : "Dark Mode"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <Dialog open={sdkDialogOpen} onOpenChange={setSdkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose an SDK</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {SDK_LIST.map((sdk) => (
              <Button
                key={sdk}
                variant="outline"
                className="justify-start"
                onClick={() => {
                  onNewSession(sdk);
                  setSdkDialogOpen(false);
                }}
              >
                <Cpu className="w-4 h-4 mr-2" />
                {sdk}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
