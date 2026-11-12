const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isTemporary = (err: unknown) => {
  const text = String(err);
  return text.includes("UNAVAILABLE") || text.includes("429");
};