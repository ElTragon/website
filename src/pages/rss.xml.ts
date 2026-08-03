import rss from "@astrojs/rss"
import { getCollection, type CollectionEntry } from "astro:content"
import { marked } from "marked"
import { site } from "../config/site"
import {
  comparePostsDescending,
  postPath,
  postSlug,
  toAbsoluteUrl,
} from "../utils/blog-routes"

const escapeAttribute = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")

const renderRssContent = (post: CollectionEntry<"blog">) => {
  const renderer = new marked.Renderer()
  renderer.image = ({ href, title, text }) => {
    const isLocalImage = href.startsWith("./")
    const imagePath = isLocalImage
      ? `/rss-assets/${postSlug(post).slice(1)}${href.slice(2)}`
      : href
    const source = isLocalImage ? toAbsoluteUrl(site.url, imagePath) : imagePath
    const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : ""
    return `<img src="${escapeAttribute(source)}" alt="${escapeAttribute(text)}"${titleAttribute}>`
  }

  return marked.parse(post.body ?? "", { renderer }) as string
}

export async function GET() {
  const posts = (await getCollection("blog")).sort(comparePostsDescending)

  return rss({
    title: "Mario Blog Feed",
    description: site.description,
    site: site.url,
    customData: `<language>en-us</language><author>${site.author.name}</author>`,
    items: posts.map((post: CollectionEntry<"blog">) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postPath(post),
      content: renderRssContent(post),
      customData: `<author>${site.author.name}</author>`,
    })),
  })
}
