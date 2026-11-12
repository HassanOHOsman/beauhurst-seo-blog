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


export async function uniqueSlug(topic: string): Promise<string> {
  const base = slugify(topic) || "blog";
  let slug = base;
  let n = 2;

  while (await getBlog(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export async function saveBlog(blog: StoredBlog): Promise<void> {
  await blogs().setItem(blog.slug, blog);
}
