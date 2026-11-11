import Papa from "papaparse";
import type { ColumnMeta } from "./types";

export function readCsv(csvText: string): Record<string, string>[] {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  if (!parsed.data.length) throw new Error("CSV has no rows");
  return parsed.data;
}

const toNumber = (value: string): number | null => {
  const cleaned = value.replace(/[£$€,%\s]/g, "");
  if (cleaned === "" || isNaN(Number(cleaned))) return null;
  return Number(cleaned);
};

export function detectColumns(rows: Record<string, string>[]): ColumnMeta[] {
  const first = rows[0];
  if (!first) return [];
  const headers = Object.keys(first);
  return headers.map((key) => {
    const values = rows.map((r) => (r[key] ?? "").trim()).filter(Boolean);
    const numeric = values.filter((v) => toNumber(v) !== null).length;
    const isNumber = values.length > 0 && numeric / values.length >= 0.8;
    return { key, type: isNumber ? "number" : "text" };
  });
}