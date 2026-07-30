import { test, expect } from "@playwright/test"

test("renders the home page", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveTitle(/Mario/)
  await expect(page.getByRole("heading", { name: "Mario Lopez" })).toBeVisible()
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
  let diagramCount = 0

  try {
    await fallbackPage.goto("/blogs/")

    const postPaths = await fallbackPage
      .locator('article a[itemprop="url"]')
      .evaluateAll(links =>
        links.map(link => new URL((link as HTMLAnchorElement).href).pathname)
      )

    expect(postPaths.length).toBeGreaterThan(0)

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
