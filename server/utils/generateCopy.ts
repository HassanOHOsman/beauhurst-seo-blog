import { createClient, MODEL } from "./callGemini";

export function buildContents(summary: unknown): string {
  return `Dataset summary:\n${JSON.stringify(summary)}`;
}

export async function generateCopy(apiKey: string, summary: unknown) {
  const ai = createClient(apiKey);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: buildContents(summary),
  });

  return response.text;
}
