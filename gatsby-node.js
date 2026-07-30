/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const {
  compareBlogPostsAscending,
  sanitizePathSegments,
  toPortableRouteKey,
  toCanonicalBlogPath,
  withTrailingSlash,
  withoutTrailingSlash,
} = require(`./src/utils/blog-routes`)

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
const claimedBlogRoutes = new Map()

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({
  graphql,
  actions,
  reporter,
  getNodesByType,
}) => {
  const { createPage, createRedirect } = actions

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { fields: { isBlog: { eq: true } } }
        sort: { frontmatter: { date: ASC } }
      ) {
        nodes {
          id
          fileAbsolutePath
          fields {
            slug
            legacyPath
          }
          frontmatter {
            date
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes.sort(
    compareBlogPostsAscending
  )
  claimedBlogRoutes.clear()
  const claimedPostPaths = new Map()
  const routeConflicts = []
  const existingPageRoutes = new Map(
    getNodesByType(`SitePage`)
      .filter(page => page.component !== blogPost)
      .map(page => [
        toPortableRouteKey(page.path),
        { component: page.component, routePath: page.path },
      ])
  )

  posts.forEach(post => {
    const { slug, legacyPath } = post.fields
    const sourcePath = post.fileAbsolutePath || `Markdown node ${post.id}`

    for (const routePath of [slug, legacyPath]) {
      const routeKey = toPortableRouteKey(routePath)
      const existingPost = claimedPostPaths.get(routeKey)
      const existingPage = existingPageRoutes.get(routeKey)

      if (existingPost && existingPost !== sourcePath) {
        routeConflicts.push(
          `"${routePath}" is claimed by both "${existingPost}" and "${sourcePath}"`
        )
      } else if (existingPage) {
        routeConflicts.push(
          `"${routePath}" from "${sourcePath}" conflicts with page component "${existingPage.component}"`
        )
      } else {
        claimedPostPaths.set(routeKey, sourcePath)
        claimedBlogRoutes.set(routeKey, { routePath, sourcePath })
      }
    }
  })

  if (routeConflicts.length > 0) {
    reporter.panicOnBuild(
      `Blog route conflicts detected:\n${routeConflicts.join(`\n`)}`
    )
    return
  }

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })

      const redirectFromPaths = new Set()

      if (post.fields.legacyPath !== post.fields.slug) {
        const encodedLegacyPath = encodeURI(post.fields.legacyPath)
        redirectFromPaths.add(encodedLegacyPath)
        redirectFromPaths.add(withoutTrailingSlash(encodedLegacyPath))
      }

      for (const fromPath of redirectFromPaths) {
        createRedirect({
          fromPath,
          toPath: post.fields.slug,
          isPermanent: true,
          redirectInBrowser: true,
        })
      }
    })
  }
}

/**
 * Fail the build if a file-based or plugin-created page would be shadowed by a
 * blog post or one of its legacy redirects. This runs when Gatsby's page
 * creator adds src/pages routes, after createPages has claimed the blog paths.
 *
 * @type {import('gatsby').GatsbyNode['onCreatePage']}
 */
exports.onCreatePage = ({ page, reporter }) => {
  const routePath = withTrailingSlash(page.path)
  const routeKey = toPortableRouteKey(routePath)
  const claimedBlogRoute = claimedBlogRoutes.get(routeKey)

  if (claimedBlogRoute && page.component !== blogPost) {
    reporter.panicOnBuild(
      `Blog route "${claimedBlogRoute.routePath}" from "${claimedBlogRoute.sourcePath}" conflicts with page component "${page.component}"`
    )
  }
}

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode, reporter }) => {
  const { createNodeField } = actions
  const parent = node.parent ? getNode(node.parent) : null

  if (
    node.internal.type === `MarkdownRemark` &&
    parent?.sourceInstanceName === `blog`
  ) {
    const sourcePath =
      parent.absolutePath || parent.relativePath || `Markdown node ${node.id}`
    const title = node.frontmatter?.title
    const date = node.frontmatter?.date
    const metadataErrors = []

    if (typeof title !== `string` || title.trim() === ``) {
      metadataErrors.push(`a non-empty "title"`)
    }

    if (
      typeof date !== `string` ||
      date.trim() === `` ||
      Number.isNaN(Date.parse(date))
    ) {
      metadataErrors.push(`a valid "date"`)
    }

    if (metadataErrors.length > 0) {
      reporter.panicOnBuild(
        `Invalid blog frontmatter in "${sourcePath}": expected ${metadataErrors.join(
          ` and `
        )}`
      )
      return
    }

    const legacyPath = sanitizePathSegments(createFilePath({ node, getNode }))
    const slug = toCanonicalBlogPath(legacyPath)

    createNodeField({
      name: `isBlog`,
      node,
      value: true,
    })

    createNodeField({
      name: `slug`,
      node,
      value: slug,
    })

    createNodeField({
      name: `legacyPath`,
      node,
      value: legacyPath,
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      isBlog: Boolean
      slug: String
      legacyPath: String
    }
  `)
}
