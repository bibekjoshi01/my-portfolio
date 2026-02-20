import type { APIContext } from "astro";
import { siteConfig } from "@data/site";

export function GET({ site }: APIContext) {
  const siteUrl = site ?? siteConfig.url;
  const sitemapUrl = new URL(
    "/sitemap-index.xml",
    siteUrl,
  ).toString();
  const host = new URL(siteUrl).host;

  return new Response(
    `User-agent: *\nAllow: /\n\nHost: ${host}\nSitemap: ${sitemapUrl}\n`,
    {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
    },
  );
}
