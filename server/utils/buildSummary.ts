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
