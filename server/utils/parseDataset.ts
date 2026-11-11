import Papa from "papaparse";

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