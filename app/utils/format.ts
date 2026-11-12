export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatFull(value: unknown): string {
  return typeof value === "number" ? value.toLocaleString("en-GB") : "";
}