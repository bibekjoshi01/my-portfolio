import { getCollection, type CollectionEntry } from 'astro:content';
import { getReadingTime } from './readingTime';

export type BlogEntry = CollectionEntry<'blog'>;

export async function getPublishedPosts(): Promise<BlogEntry[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.DEV ? true : !data.draft,
  );

  return posts.sort(
    (a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime(),
  );
}

export function getPostReadingTime(post: BlogEntry): string {
  return getReadingTime(post.body);
}

export function getAllCategories(posts: BlogEntry[]): string[] {
  return [...new Set(posts.map((post) => post.data.category))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getAllTags(posts: BlogEntry[]): string[] {
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) =>
    a.localeCompare(b),
  );
}
