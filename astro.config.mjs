import { defineConfig } from "astro/config"
import { unified } from "@astrojs/markdown-remark"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import linkedHeadings from "./scripts/rehype-linked-headings.mjs"
import {
  getLatestPostDate,
  getSitemapPostDates,
} from "./scripts/content-artifacts.mjs"

const sitemapPostDates = await getSitemapPostDates()
const latestPostDate = getLatestPostDate(sitemapPostDates)

export default defineConfig({
  site: "https://mariolopezdev.com",
  publicDir: "static",
  output: "static",
  trailingSlash: "always",
  integrations: [
    react(),
    sitemap({
      filter: page => new URL(page).pathname !== "/thanks/",
      serialize(item) {
        const pathname = new URL(item.url).pathname
        const postDate = sitemapPostDates.get(decodeURI(pathname))

        if (postDate) {
          return {
            ...item,
            lastmod: postDate.toISOString(),
            changefreq: "never",
            priority: 0.7,
          }
        }

        if (pathname === "/" || pathname === "/blogs/") {
          return {
            ...item,
            ...(latestPostDate
              ? { lastmod: latestPostDate.toISOString() }
              : {}),
            changefreq: "weekly",
            priority: 0.3,
          }
        }

        return item
      },
    }),
  ],
  markdown: {
    processor: unified({ rehypePlugins: [linkedHeadings] }),
    syntaxHighlight: "prism",
  },
})
