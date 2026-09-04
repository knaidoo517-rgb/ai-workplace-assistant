import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Copy, RefreshCw, Trash2, Loader2, Sparkle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste meeting notes and get an editable summary with key points, decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn long meeting notes into decisions, owners and deadlines in seconds.",
      },
    ],
  }),
  component: MeetingNotes,
});

const emptyForm = { notes: "", title: "", date: "", participants: "" };

function MeetingNotes() {
  const [form, setForm] = useState(emptyForm);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const run = useServerFn(summarizeMeeting);

  const update = (key: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function generate() {
    if (form.notes.trim().length < 20) {
      setError("Please paste at least a few sentences of meeting notes.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await run({ data: form });
      setOutput(result.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The AI service is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  async function copyAll() {
    await navigator.clipboard.writeText(output);
    toast.success("Summary copied to clipboard");
  }

  return (
    <AppLayout
      title="Meeting Notes Summarizer"
      description="Summary, key points, decisions and action items from raw notes"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meeting notes</CardTitle>
            <CardDescription>Title, date and participants are optional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting title</Label>
                <Input
                  id="title"
                  placeholder="Weekly project sync"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                placeholder="Thabo, Priya, Marcus…"
                value={form.participants}
                onChange={(e) => update("participants", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={14}
                placeholder="Paste your full meeting notes or transcript here…"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkle className="size-4" />
                )}
                {loading ? "Summarizing…" : "Summarize notes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setForm(emptyForm);
                  setOutput("");
                  setError("");
                }}
                disabled={loading}
              >
                <Trash2 className="size-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              Fully editable — includes decisions, action items, owners and deadlines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && !output ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Reading your notes…
              </p>
            ) : null}
            <Textarea
              aria-label="Meeting summary"
              rows={22}
              value={output}
              placeholder="Your summary, key discussion points, decisions and action items will appear here"
              onChange={(e) => setOutput(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={copyAll} disabled={!output}>
                <Copy className="size-4" />
                Copy
              </Button>
              <Button variant="outline" onClick={generate} disabled={loading || !output}>
                <RefreshCw className="size-4" />
                Regenerate
              </Button>
              <Button variant="outline" onClick={() => setOutput("")} disabled={!output}>
                <Trash2 className="size-4" />
                Clear output
              </Button>
            </div>
            <AiDisclaimer />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
