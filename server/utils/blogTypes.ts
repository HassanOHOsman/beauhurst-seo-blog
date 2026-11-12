import type { BlogCopy } from "./buildPrompt";
import type { computeStats } from "./computeStats";

export interface StoredBlog {
  slug: string;
  topic: string;
  createdAt: string;
  labelColumn: string;
  copy: BlogCopy;
  stats: ReturnType<typeof computeStats>;
}
