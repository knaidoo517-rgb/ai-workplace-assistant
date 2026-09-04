import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, SendHorizonal, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Ask workplace questions about communication, planning, task management, meeting agendas and documents, and get AI answers.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "Practical AI answers for planning, agendas, tasks and workplace writing.",
      },
    ],
  }),
  component: Chatbot,
});

type Message = { role: "user" | "assistant"; content: string };

const starters = [
  "Draft an agenda for a 30-minute project kickoff",
  "How do I politely chase an overdue deliverable?",
  "Help me prioritise 8 tasks for this week",
];

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const run = useServerFn(chatWithAssistant);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please type a question first.");
      return;
    }
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const result = await run({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: result.text }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The AI service is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout
      title="AI Workplace Chatbot"
      description="Ask about communication, planning, tasks, agendas and workplace documents"
    >
      <Card className="flex h-[calc(100vh-12rem)] min-h-[30rem] flex-col">
        <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-4 sm:p-6">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.length === 0 && !loading && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Bot className="size-6" aria-hidden="true" />
                </span>
                <p className="max-w-md text-sm text-muted-foreground">
                  Ask anything about your working day — writing, planning, meetings or
                  documents.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {starters.map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => send(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "flex justify-end gap-3"
                    : "flex justify-start gap-3"
                }
              >
                {message.role === "assistant" && (
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Bot className="size-4" aria-hidden="true" />
                  </span>
                )}
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[80%] whitespace-pre-wrap rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[80%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
                  }
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <User className="size-4" aria-hidden="true" />
                  </span>
                )}
              </div>
            ))}

            {loading && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Thinking…
              </p>
            )}
            <div ref={endRef} />
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <Textarea
              aria-label="Your message"
              rows={2}
              className="resize-none"
              placeholder="Ask a workplace question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
            />
            <Button type="submit" size="icon" disabled={loading} aria-label="Send message">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizonal className="size-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Clear conversation"
              disabled={messages.length === 0 || loading}
              onClick={() => {
                setMessages([]);
                setError("");
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </form>

          <AiDisclaimer />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
