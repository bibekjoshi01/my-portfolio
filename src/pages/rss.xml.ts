import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { siteConfig } from '@data/site';
import { getPublishedPosts } from '@utils/blog';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: `${siteConfig.name} - Technical Blog`,
    description: siteConfig.description,
    site: context.site ?? siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedDate,
      link: `/blog/${post.slug}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
  });
}
