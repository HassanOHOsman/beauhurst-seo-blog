export function buildContents(summary: unknown): string {
  return `Dataset summary:\n${JSON.stringify(summary)}`;
}
