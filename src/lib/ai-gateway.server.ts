import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(lovableApiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    supportsStructuredOutputs: false,
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export const AI_MODEL = "google/gemini-3.7-flash";

export function gatewayModel() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) {
    throw new Error(
      "The AI service is not configured right now. Please try again later.",
    );
  }
  return createLovableAiGatewayProvider(key)(AI_MODEL);
}

export function toFriendlyAiError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("429")) {
    return new Error("The AI service is busy right now. Please try again in a moment.");
  }
  if (message.includes("402")) {
    return new Error("AI credits have run out. Please add credits to continue.");
  }
  if (message.includes("401") || message.includes("403")) {
    return new Error("The AI service is unavailable. Please check the AI setup and try again.");
  }
  return new Error("The AI service could not complete this request. Please try again.");
}
