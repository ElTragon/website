import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

const blog = defineCollection({
  loader:
    process.env.ASTRO_ROUTING_FIXTURE === "1"
      ? glob({
          base: ".",
          pattern: [
            "content/blog/**/index.md",
            "tests/fixtures/blog/**/index.md",
          ],
          generateId: ({ entry }) =>
            entry
              .replace(/^(?:content|tests\/fixtures)\/blog\//, "")
              .replace(/\/index\.md$/, ""),
        })
      : glob({ base: "./content/blog", pattern: "**/index.md" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(1),
      date: z.coerce.date(),
      description: z.string().trim().min(1),
      featuredImage: image(),
    }),
})

export const collections = { blog }
