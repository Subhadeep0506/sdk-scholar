export type MessageSource = {
  title: string;
  url: string;
};

export type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  chainOfThought?: ChainOfThoughtStep[];
  isLoading?: boolean;
  sources?: MessageSource[];
  tokenUsage?: TokenUsage;
  liked?: boolean | null; // true = liked, false = disliked, null/undefined = neither
};

export type ChainOfThoughtStep = {
  id: string;
  label: string;
  description: string;
  status: "pending" | "active" | "done";
  details?: string;
};

export type ChatSession = {
  id: string;
  title: string;
  sdkFilter?: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

export type AppSettings = {
  model: string;
  temperature: number;
  webSearchEnabled: boolean;
  theme: "light" | "dark";
};

export const DEFAULT_SETTINGS: AppSettings = {
  model: "gemini-flash",
  temperature: 0.7,
  webSearchEnabled: false,
  theme: "dark",
};

export const SDK_LIST = [
  "LangChain",
  "LangGraph",
  "LlamaIndex",
  "Haystack",
  "CrewAI",
  "AutoGen",
  "Semantic Kernel",
  "Vertex AI SDK",
] as const;

export const SUGGESTED_QUERIES = [
  "Explain LangChain agents and how to build one",
  "Compare LlamaIndex vs Haystack for RAG pipelines",
  "How does CrewAI handle multi-agent orchestration?",
  "Show me a LangGraph workflow with conditional edges",
  "What's new in AutoGen 0.4 for async agents?",
  "Build a simple RAG pipeline with LlamaIndex",
];
