import { createClient, MODEL } from "./callGemini";
import { SYSTEM_INSTRUCTION, type BlogCopy } from "./buildPrompt";
import { withRetry } from "./withRetry";

export function buildContents(summary: unknown): string {
  return `Dataset summary:\n${JSON.stringify(summary)}`;
}

export async function generateCopy(
  apiKey: string,
  summary: unknown,
): Promise<BlogCopy> {
  const ai = createClient(apiKey);

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: MODEL,
      contents: buildContents(summary),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    })
  );

  const text = response.text;
  if (!text) throw new Error("Gemini returned no text");
  return JSON.parse(text) as BlogCopy;
}
