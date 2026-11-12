import type { Dataset } from "./types";
import type { computeStats } from "./computeStats";

type Stats = ReturnType<typeof computeStats>;

function topRows(ds: Dataset, stats: Stats, n = 10) {
  return stats.rankedRows.slice(0, n).map((r) => ({
    rank: r.rank,
    name: r[ds.labelColumn],
    metric: ds.metricColumn ? r[ds.metricColumn] : null,
  }));
}


export function buildSummary(ds: Dataset, stats: Stats, topic: string) {
  return {
    topic,
    rowCount: stats.rowCount,
    labelColumn: ds.labelColumn,
    metricColumn: ds.metricColumn,
    columns: ds.columns.map((c) => c.key),
    metric: stats.metric,
    categories: stats.categories,
    top10: topRows(ds, stats),
  };
}
