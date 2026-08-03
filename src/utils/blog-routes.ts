import type { CollectionEntry } from "astro:content"

export const BLOG_INDEX_PATH = "/blogs/"

const reservedSiteRoutes = [
  "/",
  BLOG_INDEX_PATH,
  "/404.html",
  "/rss.xml",
  "/thanks/",
]

export const withTrailingSlash = (pathname: string) => {
  const normalizedPath = `/${pathname.split("/").filter(Boolean).join("/")}`
  return normalizedPath === "/" ? normalizedPath : `${normalizedPath}/`
}

export const withoutTrailingSlash = (pathname: string) => {
  const normalizedPath = withTrailingSlash(pathname)
  return normalizedPath === "/" ? normalizedPath : normalizedPath.slice(0, -1)
}

export const sanitizePathSegments = (pathname: string) => {
  const safePath = pathname
    .split("/")
    .filter(Boolean)
    .map(segment => {
      const safeSegment = segment
        .normalize("NFC")
        .replace(/[^\p{Letter}\p{Number}._~-]+/gu, "-")
        .replace(/-+/g, "-")
        .replace(/^[-.]+|[-.]+$/g, "")

      if (!safeSegment || safeSegment === "." || safeSegment === "..") {
        throw new Error(`Blog path segment "${segment}" has no safe URL form`)
      }

      return safeSegment
    })
    .join("/")

  return withTrailingSlash(safePath)
}

export const toPortableRouteKey = (pathname: string) => {
  const decodedPath = withTrailingSlash(pathname)
    .split("/")
    .map(segment => {
      try {
        return decodeURIComponent(segment)
      } catch {
        return segment
      }
    })
    .join("/")

  return decodedPath.normalize("NFC").toLowerCase()
}

export const toAbsoluteUrl = (siteUrl: string, pathname: string) => {
  const baseUrl = new URL(siteUrl)
  baseUrl.pathname = `${baseUrl.pathname.replace(/\/+$/, "")}/`
  return new URL(pathname.replace(/^\/+/, ""), baseUrl).href
}

export const postSlug = (post: Pick<CollectionEntry<"blog">, "id">) => {
  const sourcePath = post.id.replace(/(?:^|\/)index(?:\.md)?$/, "")
  return sanitizePathSegments(sourcePath)
}

export const postPath = (post: Pick<CollectionEntry<"blog">, "id">) =>
  `${BLOG_INDEX_PATH}${postSlug(post).slice(1)}`

export const legacyPostPath = (post: Pick<CollectionEntry<"blog">, "id">) =>
  postSlug(post)

export const comparePostsDescending = (
  left: CollectionEntry<"blog">,
  right: CollectionEntry<"blog">,
) =>
  right.data.date.getTime() - left.data.date.getTime() ||
  postPath(left).localeCompare(postPath(right))

type RoutePost = Pick<CollectionEntry<"blog">, "id">

export const validatePostRoutes = (posts: RoutePost[]) => {
  const routes = new Map(
    reservedSiteRoutes.map(route => [
      toPortableRouteKey(route),
      `reserved site route "${route}"`,
    ]),
  )

  for (const post of posts) {
    const claims = [
      { kind: "canonical", route: postPath(post) },
      { kind: "legacy", route: legacyPostPath(post) },
    ] as const

    for (const claim of claims) {
      const routeKey = toPortableRouteKey(claim.route)
      const existing = routes.get(routeKey)

      if (existing) {
        throw new Error(
          `Blog post "${post.id}" ${claim.kind} route "${claim.route}" conflicts with ${existing}`,
        )
      }

      routes.set(
        routeKey,
        `blog post "${post.id}" ${claim.kind} route "${claim.route}"`,
      )
    }
  }
}
