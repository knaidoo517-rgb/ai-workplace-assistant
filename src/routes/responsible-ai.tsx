import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Eye, Lock, AlertTriangle } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "How this AI workplace assistant handles your information, its limits, and why human review matters before sharing AI output.",
      },
      { property: "og:title", content: "Responsible AI use in the workplace" },
      {
        property: "og:description",
        content:
          "Privacy, accuracy limits and human review guidance for AI-generated workplace content.",
      },
    ],
  }),
  component: ResponsibleAi,
});

const points = [
  {
    icon: Eye,
    title: "Always review before sending",
    body: "AI drafts are a starting point. Check names, dates, figures, commitments and tone before an email or summary leaves your hands.",
  },
  {
    icon: Lock,
    title: "Nothing is stored",
    body: "There is no account and no database here. What you type is sent to the AI service to produce a response and disappears when you clear the page.",
  },
  {
    icon: AlertTriangle,
    title: "Keep sensitive information out",
    body: "Avoid pasting personal data, confidential contracts, passwords or anything your organisation's policy would not allow in an external tool.",
  },
  {
    icon: ShieldCheck,
    title: "You stay accountable",
    body: "AI can be confidently wrong. Decisions, commitments and anything shared with colleagues or clients remain your responsibility.",
  },
];

function ResponsibleAi() {
  return (
    <AppLayout
      title="Responsible AI"
      description="How to use this assistant safely and sensibly at work"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {points.map((point) => (
          <Card key={point.title}>
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <point.icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="mt-3">{point.title}</CardTitle>
              <CardDescription>{point.body}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>

      <p className="mt-6 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
        AI-generated content may contain errors. Review and edit all information before using
        or sharing it.
      </p>
    </AppLayout>
  );
}
