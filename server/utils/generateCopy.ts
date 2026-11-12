import { createClient, MODEL } from "./callGemini";
import { SYSTEM_INSTRUCTION } from "./buildPrompt";

export function buildContents(summary: unknown): string {
  return `Dataset summary:\n${JSON.stringify(summary)}`;
}

export async function generateCopy(apiKey: string, summary: unknown) {
  const ai = createClient(apiKey);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: buildContents(summary),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text;
}
