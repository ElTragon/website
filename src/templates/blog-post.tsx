import * as React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/Bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

let nextMermaidDiagramId = 0

type MermaidApi = typeof import("mermaid")["default"]

let mermaidPromise: Promise<MermaidApi> | undefined

const loadMermaid = (): Promise<MermaidApi> => {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid")
      .then(({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false })
        return mermaid
      })
      .catch(error => {
        mermaidPromise = undefined
        throw error
      })
  }

  return mermaidPromise
}

type BlogPostBodyProps = {
  html: string
  postId: string
}

const BlogPostBody = ({ html, postId }: BlogPostBodyProps) => {
  const bodyRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const body = bodyRef.current

    if (!body) {
      return
    }

    const codeBlocks = Array.from(
      body.querySelectorAll<HTMLElement>("pre > code.language-mermaid")
    )

    if (codeBlocks.length === 0) {
      return
    }

    let cancelled = false

    const renderDiagrams = async () => {
      const mermaid = await loadMermaid()

      if (cancelled) {
        return
      }

      for (const [index, codeBlock] of codeBlocks.entries()) {
        const pre = codeBlock.parentElement

        if (!pre) {
          continue
        }

        try {
          const diagramId = `mermaid-diagram-${nextMermaidDiagramId++}`
          const { svg, bindFunctions } = await mermaid.render(
            diagramId,
            codeBlock.textContent ?? ""
          )

          if (cancelled || !pre.isConnected || !body.contains(pre)) {
            return
          }

          const diagram = document.createElement("div")
          diagram.className = "mermaid"
          diagram.innerHTML = svg
          pre.after(diagram)

          try {
            bindFunctions?.(diagram)
          } catch (error) {
            diagram.remove()
            throw error
          }

          pre.remove()
        } catch (error) {
          console.error(
            `Unable to render Mermaid diagram ${index + 1} for post ${postId}`,
            error
          )
        }
      }
    }

    void renderDiagrams().catch(error => {
      console.error("Unable to render Mermaid diagrams", error)
    })

    return () => {
      cancelled = true
    }
  }, [html, postId])

  return (
    <section
      ref={bodyRef}
      dangerouslySetInnerHTML={{ __html: html }}
      itemProp="articleBody"
    />
  )
}

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`

  return (
    <Layout>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <BlogPostBody html={post.html} postId={post.id} />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  return <Seo title={post.frontmatter.title} description={post.excerpt || ""} />
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
