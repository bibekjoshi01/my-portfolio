import type { APIContext } from "astro";
import { siteConfig } from "@data/site";

export function GET({ site }: APIContext) {
  const sitemapUrl = new URL(
    "/sitemap-index.xml",
    site ?? siteConfig.url,
  ).toString();

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
