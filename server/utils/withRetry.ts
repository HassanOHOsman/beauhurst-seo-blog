const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isTemporary = (err: unknown) => {
  const text = String(err);
  return text.includes("UNAVAILABLE") || text.includes("429");
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3
): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i >= attempts || !isTemporary(err)) throw err;
      await sleep(1000 * 2 ** i);
    }
  }
}