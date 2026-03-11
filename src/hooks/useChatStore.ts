import { useState, useCallback } from "react";
import { ChatSession, ChatMessage, ChainOfThoughtStep, AppSettings, DEFAULT_SETTINGS, MessageSource, TokenUsage } from "@/types/chat";

const generateId = () => Math.random().toString(36).substring(2, 15);

const createSession = (sdkFilter?: string): ChatSession => ({
  id: generateId(),
  title: sdkFilter ? `${sdkFilter} Chat` : "New Chat",
  sdkFilter,
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const createCoTSteps = (webSearchEnabled: boolean): ChainOfThoughtStep[] => {
  const steps: ChainOfThoughtStep[] = [
    { id: "analyze", label: "Query Analysis", description: "Rephrasing and analyzing your query...", status: "pending" },
    { id: "retrieve", label: "Document Retrieval", description: "Searching SDK documentation vector store...", status: "pending" },
  ];
  if (webSearchEnabled) {
    steps.push({ id: "websearch", label: "Web Search", description: "Fetching real-time web results...", status: "pending" });
  }
  steps.push({ id: "generate", label: "Generation", description: "Synthesizing answer from retrieved context...", status: "pending" });
  return steps;
};

// Simulated RAG response for demo (replace with Lovable AI backend)
const simulateRAGResponse = async (
  query: string,
  sdkFilter: string | undefined,
  webSearchEnabled: boolean,
  onStepUpdate: (steps: ChainOfThoughtStep[]) => void
): Promise<string> => {
  const steps = createCoTSteps(webSearchEnabled);

  for (let i = 0; i < steps.length; i++) {
    steps[i].status = "active";
    onStepUpdate([...steps]);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
    steps[i].status = "done";
    steps[i].details = getStepDetails(steps[i].id, query, sdkFilter);
    onStepUpdate([...steps]);
  }

  return generateMockAnswer(query, sdkFilter);
};

function getStepDetails(stepId: string, query: string, sdkFilter?: string): string {
  switch (stepId) {
    case "analyze": return `Rephrased: "${query}" → focused on ${sdkFilter || "agentic AI SDKs"} documentation and examples.`;
    case "retrieve": return `Found 4 relevant chunks from ${sdkFilter || "multiple SDK"} docs (similarity > 0.82).`;
    case "websearch": return "Retrieved 3 recent articles and GitHub discussions.";
    case "generate": return "Synthesized answer from 4 doc chunks + context.";
    default: return "";
  }
}

function generateMockAnswer(query: string, sdkFilter?: string): string {
  const sdk = sdkFilter || "the SDK";
  const q = query.toLowerCase();

  if (q.includes("langchain") || q.includes("agent")) {
    return `## LangChain Agents

LangChain agents are autonomous systems that use LLMs to decide which tools to call and in what order.

### Key Concepts

- **Agent**: The core reasoning engine that decides actions
- **Tools**: Functions the agent can invoke (search, calculator, API calls)
- **AgentExecutor**: Runtime that manages the agent loop

\`\`\`python
from langchain.agents import create_react_agent, AgentExecutor
from langchain_openai import ChatOpenAI
from langchain.tools import Tool

llm = ChatOpenAI(model="gpt-4")
tools = [
    Tool(name="search", func=search_fn, description="Search the web"),
    Tool(name="calculator", func=calc_fn, description="Do math"),
]

agent = create_react_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
result = executor.invoke({"input": "What is 25 * 4 + 10?"})
\`\`\`

### Best Practices
1. Keep tool descriptions clear and specific
2. Use **structured output** for complex responses
3. Add **memory** for multi-turn conversations
4. Consider **LangGraph** for complex, stateful workflows`;
  }

  if (q.includes("compare") || q.includes("vs")) {
    return `## Comparison: LlamaIndex vs Haystack

| Feature | LlamaIndex | Haystack |
|---------|-----------|----------|
| **Focus** | Data indexing & retrieval | End-to-end NLP pipelines |
| **RAG** | First-class support | Pipeline-based |
| **Vector Stores** | 20+ integrations | 10+ integrations |
| **Agents** | Built-in query agents | Custom pipelines |
| **Learning Curve** | Moderate | Steeper |

### When to Choose LlamaIndex
- You need advanced indexing strategies (tree, keyword, vector)
- Your use case is primarily Q&A over documents

### When to Choose Haystack
- You need complex NLP pipelines beyond just RAG
- You want fine-grained control over each processing step`;
  }

  return `## About ${sdk}

Based on the retrieved documentation, here's what I found about your query:

### Overview
${sdk} provides comprehensive tools for building AI-powered applications. The framework supports various use cases including:

- **Document Q&A**: Build RAG pipelines with vector stores
- **Agents**: Create autonomous AI agents with tool usage
- **Workflows**: Orchestrate complex multi-step processes

\`\`\`python
# Example usage
from ${sdkFilter?.toLowerCase().replace(/\s/g, '_') || 'sdk'} import Pipeline

pipeline = Pipeline()
pipeline.add_component("retriever", retriever)
pipeline.add_component("generator", generator)
pipeline.connect("retriever", "generator")

result = pipeline.run({"query": "${query}"})
print(result["answer"])
\`\`\`

### Key Resources
- Official documentation and guides
- GitHub repository with examples
- Community Discord for support

*Note: Connect to Lovable Cloud for live RAG with real SDK documentation.*`;
}

export function useChatStore() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => [createSession()]);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0].id);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const newSession = useCallback((sdkFilter?: string) => {
    const session = createSession(sdkFilter);
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (next.length === 0) {
        const fresh = createSession();
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (id === activeSessionId) setActiveSessionId(next[0].id);
      return next;
    });
  }, [activeSessionId]);

  const renameSession = useCallback((id: string, title: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = { id: generateId(), role: "user", content, timestamp: Date.now() };
    const aiMsgId = generateId();
    const aiMsg: ChatMessage = {
      id: aiMsgId, role: "assistant", content: "", timestamp: Date.now(),
      isLoading: true, chainOfThought: createCoTSteps(settings.webSearchEnabled),
    };

    setSessions((prev) => prev.map((s) =>
      s.id === activeSessionId
        ? {
            ...s,
            messages: [...s.messages, userMsg, aiMsg],
            title: s.messages.length === 0 ? content.slice(0, 40) + (content.length > 40 ? "..." : "") : s.title,
            updatedAt: Date.now(),
          }
        : s
    ));

    const answer = await simulateRAGResponse(
      content,
      activeSession.sdkFilter,
      settings.webSearchEnabled,
      (steps) => {
        setSessions((prev) => prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === aiMsgId ? { ...m, chainOfThought: steps } : m
                ),
              }
            : s
        ));
      }
    );

    setSessions((prev) => prev.map((s) =>
      s.id === activeSessionId
        ? {
            ...s,
            messages: s.messages.map((m) =>
              m.id === aiMsgId ? { ...m, content: answer, isLoading: false } : m
            ),
          }
        : s
    ));
  }, [activeSessionId, activeSession.sdkFilter, settings.webSearchEnabled]);

  return {
    sessions, activeSession, activeSessionId, settings,
    setActiveSessionId, newSession, deleteSession, renameSession, sendMessage, setSettings,
  };
}
