import * as React from "react"
import { HeadProps, Link, PageProps, graphql } from "gatsby"
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

type AdjacentPost = {
  fields: {
    slug: string
  }
  frontmatter: {
    title: string
  }
}

type BlogPostData = {
  markdownRemark: {
    id: string
    html: string
    excerpt: string
    fields: {
      slug: string
    }
    frontmatter: {
      title: string
      date: string
      datePublished: string
      description?: string
      featuredImage?: {
        publicURL?: string
      }
    }
  }
  previous: AdjacentPost | null
  next: AdjacentPost | null
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

const BlogPostTemplate: React.FC<PageProps<BlogPostData>> = ({
  data: { previous, next, markdownRemark: post },
}) => {
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

export const Head: React.FC<HeadProps<BlogPostData>> = ({
  data: { markdownRemark: post },
}) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
      pathname={post.fields.slug}
      imagePath={post.frontmatter.featuredImage?.publicURL}
      type="article"
      datePublished={post.frontmatter.datePublished}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        datePublished: date
        description
        featuredImage {
          publicURL
        }
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
