import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { gatewayModel, toFriendlyAiError } from "./ai-gateway.server";

async function runPrompt(system: string, prompt: string) {
  try {
    const result = streamText({
      model: gatewayModel(),
      system,
      prompt,
    });
    const text = await result.text;
    if (!text.trim()) {
      throw new Error("Empty AI response");
    }
    return text.trim();
  } catch (error) {
    throw toFriendlyAiError(error);
  }
}

function splitEmail(raw: string) {
  const match = raw.match(/^\s*subject\s*:\s*(.+)$/im);
  const subject = match?.[1]?.trim() ?? "";
  const body = match ? raw.replace(match[0], "").trim() : raw.trim();
  return { subject: subject || "Follow up", body };
}

const EmailInput = z.object({
  recipient: z.string().min(1),
  purpose: z.string().min(1),
  details: z.string().default(""),
  outcome: z.string().default(""),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  length: z.enum(["Short", "Medium", "Long"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const raw = await runPrompt(
      "You are an expert workplace communication assistant. You write original, specific, professional emails. Never use placeholder text such as [Your Name] unless no name was supplied. Output format: first line must be 'Subject: <subject line>', then a blank line, then the email body only. No commentary, no markdown fences.",
      [
        `Task: Write a workplace email.`,
        `Recipient: ${data.recipient}`,
        `Purpose: ${data.purpose}`,
        `Important details: ${data.details || "none supplied"}`,
        `Desired outcome: ${data.outcome || "not specified"}`,
        `Tone: ${data.tone}`,
        `Length: ${data.length} (Short = under 90 words, Medium = 120-180 words, Long = 220-300 words)`,
      ].join("\n"),
    );
    return splitEmail(raw);
  });

const NotesInput = z.object({
  notes: z.string().min(20),
  title: z.string().default(""),
  date: z.string().default(""),
  participants: z.string().default(""),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runPrompt(
      "You are a meticulous meeting analyst. Summarize meeting notes accurately, never inventing facts that are not in the notes. Use exactly these markdown section headings, in this order, with nothing before or after: '## Summary', '## Key Discussion Points', '## Decisions Made', '## Action Items'. Under Action Items list each item as '- Task — Owner — Deadline', using 'Not specified' where the notes do not say.",
      [
        data.title ? `Meeting title: ${data.title}` : "",
        data.date ? `Date: ${data.date}` : "",
        data.participants ? `Participants: ${data.participants}` : "",
        "Meeting notes:",
        data.notes,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    return { text };
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const result = streamText({
        model: gatewayModel(),
        system:
          "You are an AI workplace productivity assistant. You help with professional communication, planning, task and project management, meeting agendas, and workplace documents. Answer the user's specific question directly and practically, using clear markdown-free plain text with short paragraphs or simple dashed lists. If a request is outside workplace productivity, briefly redirect to what you can help with.",
        messages: data.messages,
      });
      const text = (await result.text).trim();
      if (!text) throw new Error("Empty AI response");
      return { text };
    } catch (error) {
      throw toFriendlyAiError(error);
    }
  });
