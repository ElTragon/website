import { writeFile } from "node:fs/promises"
import path from "node:path"
import {
  validatePostRoutes,
  withoutTrailingSlash,
} from "../src/utils/blog-routes.ts"
import {
  copyRssAssets,
  getPostSources,
  routeSlugFromId,
} from "./content-artifacts.mjs"

const outputRoot = path.resolve("dist")
const outputPath = path.join(outputRoot, "_redirects")
const posts = await getPostSources()
validatePostRoutes(posts)
const rules = posts
  .sort((left, right) => left.id.localeCompare(right.id))
  .flatMap(post => {
    const legacyPath = `/${routeSlugFromId(post.id)}/`
    const canonicalPath = `/blogs${legacyPath}`
    const encodedLegacyPath = encodeURI(legacyPath)
    const encodedCanonicalPath = encodeURI(canonicalPath)
    return [
      `${encodedLegacyPath}  ${encodedCanonicalPath}  301`,
      `${withoutTrailingSlash(encodedLegacyPath)}  ${encodedCanonicalPath}  301`,
    ]
  })

await writeFile(outputPath, `${rules.join("\n")}\n`, "utf8")
await copyRssAssets(outputRoot)
