import GithubSlugger from "github-slugger"
import deburr from "lodash/deburr.js"

const headingTags = new Set(["h1", "h2", "h3", "h4"])

const textContent = node => {
  if (node.type === "text") return node.value
  return Array.isArray(node.children)
    ? node.children.map(textContent).join("")
    : ""
}

const visit = (node, slugger) => {
  if (!Array.isArray(node.children)) return

  for (const child of node.children) {
    if (
      child.type === "element" &&
      headingTags.has(child.tagName) &&
      !child.children.some(
        headingChild =>
          headingChild.type === "element" &&
          headingChild.properties?.className?.includes("heading-anchor"),
      )
    ) {
      const label = textContent(child).trim()
      const id = child.properties?.id ?? deburr(slugger.slug(label, true))
      child.properties = { ...child.properties, id }
      child.children.push({
        type: "element",
        tagName: "a",
        properties: {
          ariaLabel: `Link to ${label}`,
          className: ["heading-anchor"],
          href: `#${id}`,
        },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { ariaHidden: "true" },
            children: [{ type: "text", value: "#" }],
          },
        ],
      })
    }

    visit(child, slugger)
  }
}

export default function linkedHeadings() {
  return tree => visit(tree, new GithubSlugger())
}
