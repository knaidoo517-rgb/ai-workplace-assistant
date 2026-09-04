import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, MessagesSquare, ShieldCheck, ArrowRight } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Write emails, summarize meeting notes and ask workplace questions with an AI productivity assistant. No sign-up required.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Write emails, summarize meeting notes and ask workplace questions with AI. No sign-up required.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email-generator",
    icon: Mail,
    title: "Smart Email Generator",
    description:
      "Turn a few notes into a polished email with a formal, friendly or persuasive tone.",
  },
  {
    to: "/meeting-notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description:
      "Paste raw notes and get a summary, key points, decisions and action items with owners and deadlines.",
  },
  {
    to: "/chatbot",
    icon: MessagesSquare,
    title: "AI Workplace Chatbot",
    description:
      "Ask about planning, agendas, task management and workplace documents, and get fresh answers each time.",
  },
  {
    to: "/responsible-ai",
    icon: ShieldCheck,
    title: "Responsible AI",
    description: "How this assistant handles your information and where human review matters.",
  },
] as const;

function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      description="Three AI tools to speed up everyday workplace writing and planning"
    >
      <section className="rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10">
        <h2 className="text-2xl font-semibold sm:text-3xl">Work faster on the writing part</h2>
        <p className="mt-3 max-w-2xl text-sm opacity-90 sm:text-base">
          Draft professional emails, turn messy meeting notes into clear actions, and get
          practical answers to workplace questions. Everything opens instantly — no account,
          no setup.
        </p>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="group block">
            <Card className="h-full transition-shadow group-hover:shadow-lg">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <tool.icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle className="mt-3 flex items-center gap-2">
                  {tool.title}
                  <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
