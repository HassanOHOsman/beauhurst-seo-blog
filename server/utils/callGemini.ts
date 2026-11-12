import { GoogleGenAI } from "@google/genai";

export const MODEL = "gemini-3.5-flash-lite";

export function createClient(apiKey: string) {
  if (!apiKey) throw new Error("Missing Gemini API key");
  return new GoogleGenAI({ apiKey });
}
