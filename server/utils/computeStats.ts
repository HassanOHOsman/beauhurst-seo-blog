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


export interface CategoryGroup {
  name: string;
  count: number;
  total: number;
}

export interface CategoryBreakdown {
  column: string;
  groups: CategoryGroup[];
}

export function groupByCategory(ds: Dataset): CategoryBreakdown[] {
  const { rows, columns, labelColumn, metricColumn } = ds;

  const candidates = columns.filter(
    (c) => c.type === "text" && c.key !== labelColumn
  );

  const breakdowns = candidates.map((col) => {
    const map = new Map<string, CategoryGroup>();

    for (const row of rows) {
      const cell = row[col.key];
      if (typeof cell !== "string") continue;

      const metric = metricColumn ? row[metricColumn] : null;
      const amount = typeof metric === "number" ? metric : 0;

      // A cell can hold several values, e.g. "Software; Wealth management"
      const names = cell
        .split(";")
        .map((n) => n.trim())
        .filter(Boolean);

      for (const name of names) {
        const group = map.get(name) ?? { name, count: 0, total: 0 };
        group.count += 1;
        group.total += amount;
        map.set(name, group);
      }
    }

    const groups = [...map.values()].sort((a, b) => b.count - a.count);
    return { column: col.key, groups };
  });

  // Keep only columns that genuinely group rows
  return breakdowns
    .filter((b) => b.groups.length >= 2 && (b.groups[0]?.count ?? 0) >= 2)
    .map((b) => ({ ...b, groups: b.groups.slice(0, 8) }));
}


export function computeStats(ds: Dataset) {
  return {
    rowCount: ds.rows.length,
    rankedRows: rankRows(ds),
    metric: summariseMetric(ds),
    categories: groupByCategory(ds),
  };
}
