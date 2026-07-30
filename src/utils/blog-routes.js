const BLOG_INDEX_PATH = `/blogs/`

const withTrailingSlash = pathname => {
  const normalizedPath = `/${pathname.split(`/`).filter(Boolean).join(`/`)}`
  return normalizedPath === `/` ? normalizedPath : `${normalizedPath}/`
}

const sanitizePathSegments = pathname => {
  const safePath = pathname
    .split(`/`)
    .filter(Boolean)
    .map(segment => {
      const safeSegment = segment
        .normalize(`NFC`)
        .replace(/[^\p{Letter}\p{Number}._~-]+/gu, `-`)
        .replace(/-+/g, `-`)
        .replace(/^[-.]+|[-.]+$/g, ``)

      if (safeSegment === `` || safeSegment === `.` || safeSegment === `..`) {
        throw new Error(`Blog path segment "${segment}" has no safe URL form`)
      }

      return safeSegment
    })
    .join(`/`)

  return withTrailingSlash(safePath)
}

const toPortableRouteKey = pathname => {
  const decodedPath = withTrailingSlash(pathname)
    .split(`/`)
    .map(segment => {
      try {
        return decodeURIComponent(segment)
      } catch {
        return segment
      }
    })
    .join(`/`)

  return decodedPath.normalize(`NFC`).toLowerCase()
}

const withoutTrailingSlash = pathname => {
  const normalizedPath = withTrailingSlash(pathname)
  return normalizedPath === `/` ? normalizedPath : normalizedPath.slice(0, -1)
}

const toAbsoluteUrl = (siteUrl, pathname) => {
  const baseUrl = new URL(siteUrl)
  baseUrl.pathname = `${baseUrl.pathname.replace(/\/+$/, ``)}/`

  return new URL(pathname.replace(/^\/+/, ``), baseUrl).href
}

const compareBlogPosts = (left, right, direction) => {
  const leftDate = left.frontmatter?.date || ``
  const rightDate = right.frontmatter?.date || ``
  const dateOrder = leftDate.localeCompare(rightDate)
  const slugOrder = (left.fields?.slug || ``).localeCompare(
    right.fields?.slug || ``
  )

  return direction === `desc`
    ? dateOrder * -1 || slugOrder
    : dateOrder || slugOrder
}

const compareBlogPostsAscending = (left, right) =>
  compareBlogPosts(left, right, `asc`)

const compareBlogPostsDescending = (left, right) =>
  compareBlogPosts(left, right, `desc`)

const toCanonicalBlogPath = legacyPath => {
  const normalizedPath = withTrailingSlash(legacyPath)

  // A root index.md or a "blogs" post would collide with the blog index.
  // Fail clearly instead of silently publishing it at an ambiguous URL.
  if (normalizedPath === BLOG_INDEX_PATH || normalizedPath === `/`) {
    throw new Error(
      `Blog post path "${normalizedPath}" is reserved for the blog index`
    )
  }

  if (normalizedPath.startsWith(BLOG_INDEX_PATH)) {
    return normalizedPath
  }

  return `${BLOG_INDEX_PATH.slice(0, -1)}${normalizedPath}`
}

module.exports = {
  BLOG_INDEX_PATH,
  compareBlogPostsAscending,
  compareBlogPostsDescending,
  sanitizePathSegments,
  toAbsoluteUrl,
  toPortableRouteKey,
  toCanonicalBlogPath,
  withTrailingSlash,
  withoutTrailingSlash,
}
