export type RoutableBlogPost = {
  fields?: {
    slug?: string | null
  } | null
  frontmatter?: {
    date?: string | null
  } | null
}

export const BLOG_INDEX_PATH: "/blogs/"
export function compareBlogPostsAscending(
  left: RoutableBlogPost,
  right: RoutableBlogPost
): number
export function compareBlogPostsDescending(
  left: RoutableBlogPost,
  right: RoutableBlogPost
): number
export function sanitizePathSegments(pathname: string): string
export function toAbsoluteUrl(siteUrl: string, pathname: string): string
export function toPortableRouteKey(pathname: string): string
export function toCanonicalBlogPath(legacyPath: string): string
export function withTrailingSlash(pathname: string): string
export function withoutTrailingSlash(pathname: string): string
