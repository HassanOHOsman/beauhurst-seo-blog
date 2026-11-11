import type { Dataset, Row } from "./types";

export type RankedRow = Row & { rank: number };

export function rankRows(ds: Dataset): RankedRow[] {
  const { rows, metricColumn } = ds;

  const sorted = metricColumn
    ? [...rows].sort(
        (a, b) => Number(b[metricColumn] ?? 0) - Number(a[metricColumn] ?? 0)
      )
    : rows;

  return sorted.map((row, i) => ({ ...row, rank: i + 1 }));
}


export interface MetricSummary {
  key: string;
  count: number;
  total: number;
  average: number;
  median: number;
  min: number;
  max: number;
  top10SharePct: number;
}

export function summariseMetric(ds: Dataset): MetricSummary | null {
  const { rows, metricColumn } = ds;
  if (!metricColumn) return null;

  const values = rows
    .map((r) => r[metricColumn])
    .filter((v): v is number => typeof v === "number");
  if (!values.length) return null;

  const ascending = [...values].sort((a, b) => a - b);
  const total = values.reduce((sum, n) => sum + n, 0);
  const mid = Math.floor(ascending.length / 2);
  const median =
    ascending.length % 2
      ? ascending[mid]!
      : (ascending[mid - 1]! + ascending[mid]!) / 2;

  const top10Total = ascending.slice(-10).reduce((sum, n) => sum + n, 0);

  return {
    key: metricColumn,
    count: values.length,
    total,
    average: total / values.length,
    median,
    min: ascending[0]!,
    max: ascending[ascending.length - 1]!,
    top10SharePct: total ? (top10Total / total) * 100 : 0,
  };
}
