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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate a professional workplace email from a few details, with formal, friendly or persuasive tone options.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Turn a few notes into a polished, editable professional email.",
      },
    ],
  }),
  component: EmailGenerator,
});

const emptyForm = {
  recipient: "",
  purpose: "",
  details: "",
  outcome: "",
  tone: "Formal" as "Formal" | "Friendly" | "Persuasive",
  length: "Medium" as "Short" | "Medium" | "Long",
};

function EmailGenerator() {
  const [form, setForm] = useState(emptyForm);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const run = useServerFn(generateEmail);

  const update = (key: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function generate() {
    if (!form.recipient.trim() || !form.purpose.trim()) {
      setError("Please enter at least the recipient and the purpose of the email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await run({ data: form });
      setSubject(result.subject);
      setBody(result.body);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The AI service is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  async function copyAll() {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    toast.success("Email copied to clipboard");
  }

  function clearAll() {
    setForm(emptyForm);
    setSubject("");
    setBody("");
    setError("");
  }

  return (
    <AppLayout
      title="Smart Email Generator"
      description="Describe the situation and get a ready-to-edit professional email"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Email details</CardTitle>
            <CardDescription>The more context you give, the better the draft.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Sarah Naidoo, Operations Manager"
                value={form.recipient}
                onChange={(e) => update("recipient", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Email purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Request a deadline extension"
                value={form.purpose}
                onChange={(e) => update("purpose", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Important details</Label>
              <Textarea
                id="details"
                rows={4}
                placeholder="Dates, numbers, background, names to mention…"
                value={form.details}
                onChange={(e) => update("details", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outcome">Desired outcome</Label>
              <Input
                id="outcome"
                placeholder="e.g. Approval to move the delivery to 12 March"
                value={form.outcome}
                onChange={(e) => update("outcome", e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={form.tone} onValueChange={(v) => update("tone", v)}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Formal", "Friendly", "Persuasive"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Select value={form.length} onValueChange={(v) => update("length", v)}>
                  <SelectTrigger id="length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Short", "Medium", "Long"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                {loading ? "Generating…" : "Generate email"}
              </Button>
              <Button variant="outline" onClick={clearAll} disabled={loading}>
                <Trash2 className="size-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your email</CardTitle>
            <CardDescription>Everything below is editable.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && !body ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Writing your email…
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject line</Label>
              <Input
                id="subject"
                value={subject}
                placeholder="Your subject line will appear here"
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Email body</Label>
              <Textarea
                id="body"
                rows={16}
                value={body}
                placeholder="Your generated email will appear here"
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={copyAll} disabled={!body}>
                <Copy className="size-4" />
                Copy
              </Button>
              <Button variant="outline" onClick={generate} disabled={loading || !body}>
                <RefreshCw className="size-4" />
                Regenerate
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubject("");
                  setBody("");
                }}
                disabled={!body && !subject}
              >
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
