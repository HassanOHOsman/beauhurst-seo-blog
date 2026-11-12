import type { StoredBlog } from "./blogTypes";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const blogs = () => useStorage("blogs");

export async function getBlog(slug: string): Promise<StoredBlog | null> {
  return await blogs().getItem<StoredBlog>(slug);
}
