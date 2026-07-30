import * as React from "react"
import { Link, graphql, PageProps } from "gatsby"

import Bio from "../components/Bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { compareBlogPostsDescending } from "../utils/blog-routes"

interface Frontmatter {
  date: string
  formattedDate: string
  title: string
  description?: string
}

interface PostNode {
  excerpt: string
  fields: {
    slug: string
    legacyPath: string
  }
  frontmatter: Frontmatter
}

interface BlogIndexData {
  allMarkdownRemark: {
    nodes: PostNode[]
  }
}

const BlogIndex: React.FC<PageProps<BlogIndexData>> = ({ data }) => {
  const posts = [...data.allMarkdownRemark.nodes].sort(
    compareBlogPostsDescending
  )

  if (posts.length === 0) {
    return (
      <Layout>
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout>
      <h2>Blogs</h2>
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.formattedDate}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head: React.FC = () => (
  <Seo title="All posts" description={"Check out all my blogs"} />
)

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fields: { isBlog: { eq: true } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        excerpt
        fields {
          slug
          legacyPath
        }
        frontmatter {
          date
          formattedDate: date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
