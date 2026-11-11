import { readFileSync } from "node:fs";
import { parseDataset } from "../utils/parseDataset";

export default defineEventHandler(() => {
  const csv = readFileSync("data/fintech_companies_seed.csv", "utf-8");
  const ds = parseDataset(csv);
  return {
    columns: ds.columns,
    labelColumn: ds.labelColumn,
    metricColumn: ds.metricColumn,
    rowCount: ds.rows.length,
    firstRow: ds.rows[0],
  };
});
