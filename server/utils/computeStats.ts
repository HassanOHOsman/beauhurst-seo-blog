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
