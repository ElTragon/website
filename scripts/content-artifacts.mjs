import { access, copyFile, mkdir, readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { sanitizePathSegments } from "../src/utils/blog-routes.ts"

const fixtureEnabled = process.env.ASTRO_ROUTING_FIXTURE === "1"
const rssImageExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
])

export const contentRoots = [
  path.resolve("content/blog"),
  ...(fixtureEnabled ? [path.resolve("tests/fixtures/blog")] : []),
]

const pathExists = async filePath =>
  access(filePath)
    .then(() => true)
    .catch(() => false)

const findPostDirectories = async (root, directory = root) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const hasIndex = entries.some(
    entry => entry.isFile() && entry.name === "index.md",
  )
  const nestedDirectories = entries.filter(entry => entry.isDirectory())
  const nestedPosts = await Promise.all(
    nestedDirectories.map(entry =>
      findPostDirectories(root, path.join(directory, entry.name)),
    ),
  )

  return [
    ...(hasIndex
      ? [
          {
            directory,
            id: path.relative(root, directory).split(path.sep).join("/"),
          },
        ]
      : []),
    ...nestedPosts.flat(),
  ]
}

export const getPostSources = async () => {
  const existingRoots = []
  for (const root of contentRoots) {
    if (await pathExists(root)) existingRoots.push(root)
  }
  return (
    await Promise.all(existingRoots.map(root => findPostDirectories(root)))
  ).flat()
}

export const routeSlugFromId = id => sanitizePathSegments(id).slice(1, -1)

export const getSitemapPostDates = async () => {
  const dates = new Map()

  for (const post of await getPostSources()) {
    const markdown = await readFile(
      path.join(post.directory, "index.md"),
      "utf8",
    )
    const rawDate = markdown.match(/^date:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]
    if (!rawDate || Number.isNaN(Date.parse(rawDate))) {
      throw new Error(`Missing or invalid post date in ${post.directory}`)
    }
    dates.set(`/blogs/${routeSlugFromId(post.id)}/`, new Date(rawDate))
  }

  return dates
}

export const getLatestPostDate = postDates => {
  const timestamps = Array.from(postDates.values(), date => date.getTime())
  return timestamps.length > 0 ? new Date(Math.max(...timestamps)) : undefined
}

const copyDirectoryAssets = async (source, destination) => {
  await mkdir(destination, { recursive: true })
  const entries = await readdir(source, { withFileTypes: true })

  await Promise.all(
    entries.map(async entry => {
      const sourcePath = path.join(source, entry.name)
      const destinationPath = path.join(destination, entry.name)
      if (entry.isDirectory()) {
        await copyDirectoryAssets(sourcePath, destinationPath)
      } else if (
        entry.isFile() &&
        rssImageExtensions.has(path.extname(entry.name).toLowerCase())
      ) {
        await copyFile(sourcePath, destinationPath)
      }
    }),
  )
}

export const copyRssAssets = async outputRoot => {
  for (const post of await getPostSources()) {
    await copyDirectoryAssets(
      post.directory,
      path.join(outputRoot, "rss-assets", routeSlugFromId(post.id)),
    )
  }
}
