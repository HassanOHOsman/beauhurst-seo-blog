import { readFileSync } from "node:fs";
import { parseDataset } from "../utils/parseDataset";
import { computeStats } from "../utils/computeStats";

export default defineEventHandler(() => {
  const csv = readFileSync("data/fintech_companies_seed.csv", "utf-8");
  const stats = computeStats(parseDataset(csv));
  return { ...stats, rankedRows: stats.rankedRows.slice(0, 3) };
});
