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
