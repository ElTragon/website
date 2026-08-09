import { test, expect } from "@playwright/test"
import { readFile } from "node:fs/promises"
import path from "node:path"
import {
  sanitizePathSegments,
  toAbsoluteUrl,
  toPortableRouteKey,
  validatePostRoutes,
} from "../src/utils/blog-routes"
import { getLatestPostDate } from "../scripts/content-artifacts.mjs"

test("normalizes unusual and absolute blog routes", () => {
  expect(sanitizePathSegments("/c# and cafe\u0301?/literal-%2F/")).toBe(
    "/c-and-café/literal-2F/",
  )
  expect(toPortableRouteKey("/Blogs/CAF%C3%89/")).toBe(
    toPortableRouteKey("/blogs/cafe\u0301/"),
  )
  expect(toAbsoluteUrl("https://example.com/site/", "/blogs/example/")).toBe(
    "https://example.com/site/blogs/example/",
  )
})

test("supports sitemap generation without blog posts", () => {
  expect(getLatestPostDate(new Map())).toBeUndefined()
})

test("rejects legacy post routes that shadow site pages", () => {
  const reservedRouteFixtures = [{ id: "blogs" }, { id: "thanks" }]

  for (const fixture of reservedRouteFixtures) {
    expect(() => validatePostRoutes([fixture])).toThrow(
      new RegExp(`legacy route.*reserved site route.*${fixture.id}`),
    )
  }

  expect(() =>
    validatePostRoutes([{ id: "example" }, { id: "blogs/example" }]),
  ).toThrow(/legacy route.*conflicts with blog post.*canonical route/)
})

test("presents the FDE-oriented homepage with canonical identity metadata", async ({
  page,
}) => {
  await page.goto("/")
  await expect(page).toHaveTitle(
    "Full-Stack Engineer for Complex Customer Problems | Mario Lopez",
  )
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Full-Stack Engineer for Complex Customer Problems",
  )
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /integrations, customer workflows, regulated systems/,
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://mariolopezdev.com/",
  )
  await expect(
    page.locator('link[type="application/rss+xml"]'),
  ).toHaveAttribute("href", "/rss.xml")

  const structuredData = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ??
      "{}",
  )
  expect(structuredData.about).toMatchObject({
    "@type": "Person",
    name: "Mario Lopez",
    jobTitle: "Full-Stack Engineer",
    email: "mailto:m9lopeztri@gmail.com",
    telephone: "+1-818-489-6242",
  })
})

test("connects homepage actions to work, contact, and the selected resume", async ({
  page,
  request,
}) => {
  await page.goto("/")

  await page.getByRole("link", { name: "View Work", exact: true }).click()
  await expect(page).toHaveURL(/\/#work$/)
  await expect(
    page.getByRole("heading", {
      name: "From unclear workflows to dependable systems",
    }),
  ).toBeVisible()

  await expect(
    page.getByRole("link", { name: "m9lopeztri@gmail.com" }),
  ).toHaveAttribute("href", "mailto:m9lopeztri@gmail.com")
  await expect(
    page.getByRole("link", { name: "818-489-6242" }),
  ).toHaveAttribute("href", "tel:+18184896242")

  const resumeLink = page.getByRole("link", { name: /Resume$/ })
  await expect(resumeLink).toHaveAttribute("href", "/resume.pdf")
  const resumeResponse = await request.get("/resume.pdf")
  expect(resumeResponse.ok()).toBe(true)
  expect(resumeResponse.headers()["content-type"]).toContain("application/pdf")
  expect((await resumeResponse.body()).subarray(0, 5).toString()).toBe("%PDF-")
})

test("closes mobile navigation when selecting the current route", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto("/")
  const menuButton = page.getByRole("button", { name: "Open navigation menu" })
  await menuButton.click()
  await page.getByRole("link", { name: "Home", exact: true }).click()
  await expect(menuButton).toBeVisible()
})

test("uses canonical blog routes and preserves legacy redirects", async ({
  page,
}) => {
  await page.goto("/blogs/")
  const postLinks = page.locator('article a[itemprop="url"]')
  const postPaths = await postLinks.evaluateAll(links =>
    links.map(link => new URL((link as HTMLAnchorElement).href).pathname),
  )
  expect(postPaths.length).toBeGreaterThan(0)
  expect(
    await postLinks.evaluateAll(links =>
      links.every(link => !link.hasAttribute("target")),
    ),
  ).toBe(true)

  const redirects = await readFile(path.resolve("dist/_redirects"), "utf8")
  const redirectRules = redirects.split(/\r?\n/).filter(Boolean)

  for (const postPath of postPaths) {
    const decodedPostPath = decodeURI(postPath)
    expect(decodedPostPath).toMatch(/^\/blogs\/.+\/$/)
    expect(decodedPostPath).not.toContain("/blogs/blogs/")
    expect((await page.goto(postPath))?.ok()).toBe(true)

    const legacyPath = decodedPostPath.replace(/^\/blogs/, "")
    const encodedLegacyPath = encodeURI(legacyPath)
    expect(redirectRules).toContain(
      `${encodedLegacyPath}  ${encodeURI(decodedPostPath)}  301`,
    )
    expect(redirectRules).toContain(
      `${encodedLegacyPath.slice(0, -1)}  ${encodeURI(decodedPostPath)}  301`,
    )
  }
})

test("publishes every post through the sitemap and RSS feed", async ({
  page,
}) => {
  await page.goto("/blogs/")
  const postPaths = await page
    .locator('article a[itemprop="url"]')
    .evaluateAll(links =>
      links.map(link => new URL((link as HTMLAnchorElement).href).pathname),
    )
  const sitemapIndex = await readFile(
    path.resolve("dist/sitemap-index.xml"),
    "utf8",
  )
  const sitemapName =
    sitemapIndex.match(/sitemap-[^<]+\.xml/)?.[0] ?? "sitemap-0.xml"
  const sitemap = await readFile(path.resolve("dist", sitemapName), "utf8")
  const rss = await readFile(path.resolve("dist/rss.xml"), "utf8")

  for (const postPath of postPaths) {
    const absoluteUrl = `https://mariolopezdev.com${encodeURI(decodeURI(postPath))}`
    expect(sitemap).toContain(absoluteUrl)
    expect(rss).toContain(absoluteUrl)
  }
  expect(rss).toContain("Mario Lopez")
  expect(rss).not.toContain("[object Object]")
  expect(rss).not.toContain("src=&quot;./")
  expect(rss).toContain("src=&quot;https://mariolopezdev.com/rss-assets/")
  const rssAssetPaths = Array.from(
    rss.matchAll(/https:\/\/mariolopezdev\.com(\/rss-assets\/[^&]+)&quot;/g),
    match => match[1],
  )
  expect(rssAssetPaths.length).toBeGreaterThan(0)
  for (const assetPath of rssAssetPaths) {
    expect((await page.request.get(assetPath)).ok()).toBe(true)
  }
  expect(sitemap).not.toContain("https://mariolopezdev.com/thanks/")
  expect(sitemap).toContain("<changefreq>weekly</changefreq>")
  expect(sitemap).toContain("<priority>0.3</priority>")
})

test("publishes encoded fixture routes through every generated artifact", async ({
  page,
}) => {
  await page.goto("/blogs/")
  const fixtureLink = page.getByRole("link", {
    name: "Encoded routing fixture",
  })

  test.skip(
    (await fixtureLink.count()) === 0,
    "The routing fixture is enabled by the complete npm test command",
  )

  const canonicalPath = "/blogs/café/"
  const encodedCanonicalPath = "/blogs/caf%C3%A9/"
  const encodedLegacyPath = "/caf%C3%A9/"
  await expect(fixtureLink).toHaveAttribute("href", canonicalPath)
  expect((await page.goto(encodedCanonicalPath))?.ok()).toBe(true)

  const redirects = await readFile(path.resolve("dist/_redirects"), "utf8")
  expect(redirects).toContain(
    `${encodedLegacyPath}  ${encodedCanonicalPath}  301`,
  )
  expect(redirects).toContain(
    `${encodedLegacyPath.slice(0, -1)}  ${encodedCanonicalPath}  301`,
  )

  const sitemap = await readFile(path.resolve("dist/sitemap-0.xml"), "utf8")
  const rss = await readFile(path.resolve("dist/rss.xml"), "utf8")
  const absoluteUrl = `https://mariolopezdev.com${encodedCanonicalPath}`
  expect(sitemap).toContain(absoluteUrl)
  expect(sitemap).toContain("<lastmod>2099-01-01T00:00:00.000Z</lastmod>")
  expect(sitemap).toContain("<changefreq>never</changefreq>")
  expect(sitemap).toContain("<priority>0.7</priority>")
  expect(rss).toContain(absoluteUrl)
  expect(rss).toContain(
    "https://mariolopezdev.com/rss-assets/caf%C3%A9/rss-image.svg",
  )
  expect(
    (await page.request.get("/rss-assets/caf%C3%A9/rss-image.svg")).ok(),
  ).toBe(true)
  expect(
    (
      await page.request.get("/rss-assets/caf%C3%A9/private-notes.txt")
    ).status(),
  ).toBe(404)
  await expect(
    page.locator('h2#Cafe-Resume > a.heading-anchor[href="#Cafe-Resume"]'),
  ).toHaveCount(1)
})

test("adds accessible links to Markdown headings", async ({ page }) => {
  await page.goto("/blogs/add-anchor-7-15-2023/")
  const anchor = page.locator(
    'h1#Why-should-you-do-this > a.heading-anchor[href="#Why-should-you-do-this"]',
  )
  await expect(anchor).toHaveCount(1)
  await expect(anchor).toHaveAttribute(
    "aria-label",
    "Link to Why should you do this",
  )
  await anchor.focus()
  await expect(anchor).toBeVisible()
  await anchor.click()
  await expect(page).toHaveURL(/#Why-should-you-do-this$/)
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
  const mermaidPosts: Array<{ postPath: string; sourceBlockCount: number }> = []

  try {
    await fallbackPage.goto("/blogs/")
    const postPaths = await fallbackPage
      .locator('article a[itemprop="url"]')
      .evaluateAll(links =>
        links.map(link => new URL((link as HTMLAnchorElement).href).pathname),
      )
    for (const postPath of postPaths) {
      await fallbackPage.goto(postPath)
      const sourceBlockCount = await fallbackPage
        .locator("pre > code.language-mermaid")
        .count()
      if (sourceBlockCount > 0) {
        mermaidPosts.push({ postPath, sourceBlockCount })
      }
    }
  } finally {
    await fallbackContext.close()
  }

  expect(mermaidPosts.length).toBeGreaterThan(0)
  for (const { postPath, sourceBlockCount } of mermaidPosts) {
    await page.goto(postPath)
    await expect(page.locator(".mermaid svg")).toHaveCount(sourceBlockCount)
    await expect(page.locator("pre > code.language-mermaid")).toHaveCount(0)
  }
})

test("renders article metadata and the custom not-found page", async ({
  page,
}) => {
  await page.goto("/blogs/")
  await page.locator('article a[itemprop="url"]').first().click()
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  )
  const structuredData = await page
    .locator('script[type="application/ld+json"]')
    .textContent()
  expect(structuredData).toContain("BlogPosting")

  const response = await page.goto("/this-page-does-not-exist/")
  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading", { name: /not found/i })).toBeVisible()
})
