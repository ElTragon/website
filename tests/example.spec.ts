import { test, expect } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"

const {
  sanitizePathSegments,
  toAbsoluteUrl,
  toPortableRouteKey,
  toCanonicalBlogPath,
} = require("../src/utils/blog-routes")

test("sanitizes unusual blog path segments before Gatsby creates pages", () => {
  const legacyPath = sanitizePathSegments("/c# and cafe\u0301?/literal-%2F/")

  expect(legacyPath).toBe("/c-and-café/literal-2F/")
  expect(toCanonicalBlogPath(legacyPath)).toBe("/blogs/c-and-café/literal-2F/")
  expect(toPortableRouteKey("/Blogs/CAF%C3%89/")).toBe(
    toPortableRouteKey("/blogs/cafe\u0301/")
  )
  expect(toAbsoluteUrl("https://example.com/site/", "/blogs/example/")).toBe(
    "https://example.com/site/blogs/example/"
  )
})

test("rejects blog posts with missing required frontmatter", () => {
  const gatsbyNode = require("../gatsby-node")
  const createdFields: unknown[] = []
  let buildError = ""

  gatsbyNode.onCreateNode({
    node: {
      id: "invalid-post",
      parent: "invalid-file",
      frontmatter: { title: "Missing date" },
      internal: { type: "MarkdownRemark" },
    },
    actions: {
      createNodeField: (field: unknown) => createdFields.push(field),
    },
    getNode: () => ({
      relativePath: "invalid/index.md",
      sourceInstanceName: "blog",
      internal: { type: "File" },
    }),
    reporter: {
      panicOnBuild: (message: string) => {
        buildError = message
      },
    },
  })

  expect(buildError).toContain(`a valid "date"`)
  expect(createdFields).toEqual([])
})

test("passes encoded routes through Gatsby page and redirect APIs", async () => {
  const gatsbyNode = require("../gatsby-node")
  const markdownNode = {
    id: "encoded-post",
    parent: "encoded-file",
    frontmatter: {
      title: "Encoded routing fixture",
      date: "2099-01-01T00:00:00.000Z",
    },
    internal: { type: "MarkdownRemark" },
  }
  const fileNode = {
    id: "encoded-file",
    relativePath: "c# and cafe\u0301?/index.md",
    sourceInstanceName: "blog",
    internal: { type: "File" },
  }
  const nodeFields = new Map<string, unknown>()

  gatsbyNode.onCreateNode({
    node: markdownNode,
    actions: {
      createNodeField: ({ name, value }: { name: string; value: unknown }) => {
        nodeFields.set(name, value)
      },
    },
    getNode: (id: string) => (id === fileNode.id ? fileNode : undefined),
    reporter: {
      panicOnBuild: (message: string) => {
        throw new Error(message)
      },
    },
  })

  const pages: Array<{ path: string }> = []
  const redirects: Array<{ fromPath: string; toPath: string }> = []

  await gatsbyNode.createPages({
    graphql: async () => ({
      data: {
        allMarkdownRemark: {
          nodes: [
            {
              id: markdownNode.id,
              fileAbsolutePath: "/content/blog/c# and café?/index.md",
              fields: {
                slug: nodeFields.get("slug"),
                legacyPath: nodeFields.get("legacyPath"),
              },
              frontmatter: { date: "2024-01-01" },
            },
          ],
        },
      },
    }),
    actions: {
      createPage: (page: { path: string }) => pages.push(page),
      createRedirect: (redirect: { fromPath: string; toPath: string }) =>
        redirects.push(redirect),
    },
    reporter: {
      panicOnBuild: (message: string) => {
        throw new Error(message)
      },
    },
    getNodesByType: () => [],
  })

  const canonicalPath = "/blogs/c-and-café/"
  const encodedLegacyPath = "/c-and-caf%C3%A9/"

  expect(pages).toContainEqual(expect.objectContaining({ path: canonicalPath }))
  expect(redirects).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        fromPath: encodedLegacyPath,
        toPath: canonicalPath,
      }),
      expect.objectContaining({
        fromPath: encodedLegacyPath.slice(0, -1),
        toPath: canonicalPath,
      }),
    ])
  )
})

test("renders the home page", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveTitle(/Mario/)
  await expect(page.getByRole("heading", { name: "Mario Lopez" })).toBeVisible()
})

test("publishes canonical social and structured metadata", async ({ page }) => {
  await page.goto("/")

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://mariolopezdev.com/"
  )
  await expect(
    page.locator('link[type="application/rss+xml"]')
  ).toHaveAttribute("href", "https://mariolopezdev.com/rss.xml")
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest"
  )
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website"
  )
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://mariolopezdev.com/"
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /^https:\/\/mariolopezdev\.com\/.+/
  )
  await expect(page.locator('meta[name="twitter:creator"]')).toHaveAttribute(
    "content",
    "@guythatcodes"
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary"
  )

  const structuredData = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ||
      "{}"
  ) as {
    "@type"?: string
    url?: string
  }

  expect(structuredData["@type"]).toBe("WebPage")
  expect(structuredData.url).toBe("https://mariolopezdev.com/")
})

test("publishes article metadata for blog posts", async ({ page }) => {
  const postPath = "/blogs/hire-me-4-13-2024/"
  await page.goto(postPath)

  const canonicalUrl = `https://mariolopezdev.com${postPath}`
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    canonicalUrl
  )
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article"
  )
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    canonicalUrl
  )
  await expect(
    page.locator('meta[property="article:published_time"]')
  ).toHaveAttribute("content", /^\d{4}-\d{2}-\d{2}T/)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /^https:\/\/mariolopezdev\.com\/static\/.+/
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image"
  )

  const structuredData = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ||
      "{}"
  ) as {
    "@type"?: string
    datePublished?: string
    mainEntityOfPage?: string
  }

  expect(structuredData["@type"]).toBe("BlogPosting")
  expect(structuredData.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  expect(structuredData.mainEntityOfPage).toBe(canonicalUrl)
})

test("keeps non-content pages out of search indexes", async ({ page }) => {
  for (const pathname of ["/thanks/", "/this-page-does-not-exist/"]) {
    await page.goto(pathname)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow"
    )
  }
})

test("closes mobile navigation when selecting the current route", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto("/")

  const menuButton = page.getByRole("button", {
    name: "Open navigation menu",
  })
  await menuButton.click()
  await page.getByRole("link", { name: "Home", exact: true }).click()

  await expect(menuButton).toBeVisible()
})

test("publishes the encoded route through Gatsby and generated artifacts", async ({
  page,
}) => {
  const encodedLegacyPath = "/c-and-caf%C3%A9/"
  const canonicalPath = "/blogs/c-and-café/"
  const encodedCanonicalPath = "/blogs/c-and-caf%C3%A9/"

  await page.goto("/blogs/")
  const fixtureLink = page.getByRole("link", {
    name: "Encoded routing fixture",
  })

  test.skip(
    (await fixtureLink.count()) === 0,
    "The routing fixture is enabled by the complete npm test command"
  )

  await expect(fixtureLink).toBeVisible()
  const response = await page.goto(encodedCanonicalPath)
  expect(response?.ok()).toBe(true)

  const redirects = await readFile(
    path.resolve(process.cwd(), "public/_redirects"),
    "utf8"
  )
  expect(redirects).toContain(`${encodedLegacyPath}  ${canonicalPath}  301`)
  expect(redirects).toContain(
    `${encodedLegacyPath.slice(0, -1)}  ${canonicalPath}  301`
  )

  const sitemap = await readFile(
    path.resolve(process.cwd(), "public/sitemap-0.xml"),
    "utf8"
  )
  const rss = await readFile(
    path.resolve(process.cwd(), "public/rss.xml"),
    "utf8"
  )
  const absoluteUrl = `https://mariolopezdev.com${encodedCanonicalPath}`

  expect(sitemap).toContain(absoluteUrl)
  expect(rss).toContain(absoluteUrl)
  expect(rss).toContain("<author><![CDATA[Mario Lopez]]></author>")
  expect(rss).not.toContain("[object Object]")
})

test("uses canonical blog routes and preserves legacy redirects", async ({
  page,
}) => {
  await page.goto("/blogs/")

  const postLinks = page.locator('article a[itemprop="url"]')
  const postPaths = await postLinks.evaluateAll(links =>
    links.map(link => new URL((link as HTMLAnchorElement).href).pathname)
  )

  expect(
    await postLinks.evaluateAll(links =>
      links.every(link => !link.hasAttribute("target"))
    )
  ).toBe(true)

  for (const postPath of postPaths) {
    expect(postPath).toMatch(/^\/blogs\/.+\/$/)
    expect(postPath).not.toMatch(/^\/blogs\/blogs\//)
    const response = await page.goto(postPath)
    expect(response?.ok()).toBe(true)
  }

  const redirects = await readFile(
    path.resolve(process.cwd(), "public/_redirects"),
    "utf8"
  )
  const redirectRules = redirects
    .split(/\r?\n/)
    .map(line => line.trim().split(/\s+/))
    .filter(parts => parts.length >= 3)

  const pageDataResponse = await page.request.get(
    "/page-data/blogs/page-data.json"
  )
  expect(pageDataResponse.ok()).toBe(true)

  const pageData = (await pageDataResponse.json()) as {
    result: {
      data: {
        allMarkdownRemark: {
          nodes: Array<{
            fields: {
              slug: string
              legacyPath: string
            }
          }>
        }
      }
    }
  }

  for (const { fields } of pageData.result.data.allMarkdownRemark.nodes) {
    await page.goto(fields.slug.slice(0, -1))
    await expect
      .poll(() => decodeURI(new URL(page.url()).pathname))
      .toBe(fields.slug)

    if (fields.legacyPath !== fields.slug) {
      const encodedLegacyPath = encodeURI(fields.legacyPath)

      for (const legacyPath of [
        encodedLegacyPath,
        encodedLegacyPath.slice(0, -1),
      ]) {
        expect(redirectRules).toContainEqual([legacyPath, fields.slug, "301"])

        await page.goto(legacyPath)
        await expect
          .poll(() => decodeURI(new URL(page.url()).pathname))
          .toBe(fields.slug)
      }
    }
  }
})

test("renders every Mermaid diagram with a no-JavaScript fallback", async ({
  baseURL,
  browser,
  page,
}) => {
  const fallbackContext = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  })
  const fallbackPage = await fallbackContext.newPage()
  const mermaidPosts: Array<{
    postPath: string
    sourceBlockCount: number
  }> = []
  let postCount = 0
  let diagramCount = 0

  try {
    await fallbackPage.goto("/blogs/")

    const postPaths = await fallbackPage
      .locator('article a[itemprop="url"]')
      .evaluateAll(links =>
        links.map(link => new URL((link as HTMLAnchorElement).href).pathname)
      )

    postCount = postPaths.length

    for (const postPath of postPaths) {
      await fallbackPage.goto(postPath)

      const sourceBlocks = fallbackPage.locator("pre > code.language-mermaid")
      const sourceBlockCount = await sourceBlocks.count()

      if (sourceBlockCount > 0) {
        mermaidPosts.push({ postPath, sourceBlockCount })
        diagramCount += sourceBlockCount

        for (let index = 0; index < sourceBlockCount; index += 1) {
          await expect(sourceBlocks.nth(index)).toBeVisible()
        }
      }
    }
  } finally {
    await fallbackContext.close()
  }

  if (postCount === 0) {
    return
  }

  expect(diagramCount).toBeGreaterThan(0)

  const renderErrors: string[] = []
  page.on("console", message => {
    if (
      message.type() === "error" &&
      message.text().includes("Unable to render Mermaid diagram")
    ) {
      renderErrors.push(message.text())
    }
  })

  for (const { postPath, sourceBlockCount } of mermaidPosts) {
    await page.goto(postPath)
    await expect(page.locator(".mermaid svg")).toHaveCount(sourceBlockCount)
    await expect(page.locator("pre > code.language-mermaid")).toHaveCount(0)
  }

  expect(renderErrors).toEqual([])
})

test("renders the custom not-found page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist/")

  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading", { name: /not found/i })).toBeVisible()
})
