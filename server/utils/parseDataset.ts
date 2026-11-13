import Papa from "papaparse";
import type { ColumnMeta, Dataset, Row } from "./types";

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

const NAME_HINT = /name|company|organi[sz]ation|business/i;

export function detectLabelColumn(
  rows: Record<string, string>[],
  columns: ColumnMeta[]
): string {
  const textColumns = columns.filter((c) => c.type === "text");

  const ranked = textColumns
    .map((c) => {
      const values = rows.map((r) => (r[c.key] ?? "").trim());
      return {
        key: c.key,
        unique: new Set(values).size,
        avgLen: values.reduce((sum, v) => sum + v.length, 0) / values.length,
      };
    })
    .sort(
      (a, b) =>
        b.unique - a.unique ||
        Number(NAME_HINT.test(b.key)) - Number(NAME_HINT.test(a.key)) ||
        a.avgLen - b.avgLen
    );

  return ranked[0]?.key ?? columns[0]?.key ?? "";
}

export function detectMetricColumn(columns: ColumnMeta[]): string | null {
  const numberColumns = columns.filter((c) => c.type === "number");

  const preferred = numberColumns.find((c) =>
    /fund|rais|revenue|valuation|total/i.test(c.key)
  );

  return preferred?.key ?? numberColumns[0]?.key ?? null;
}

export function parseDataset(csvText: string): Dataset {
  const raw = readCsv(csvText);
  const columns = detectColumns(raw);
  const labelColumn = detectLabelColumn(raw, columns);
  const metricColumn = detectMetricColumn(columns);

  const rows: Row[] = raw.map((r) => {
    const row: Row = {};
    for (const col of columns) {
      const value = (r[col.key] ?? "").trim();
      row[col.key] =
        col.type === "number" ? toNumber(value) : value === "" ? null : value;
    }
    return row;
  });

  return { columns, rows, labelColumn, metricColumn };
}