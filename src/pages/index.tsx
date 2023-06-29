import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/Bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { getSrc } from "gatsby-plugin-image"
import { directiveSanitizer } from "mermaid/dist/utils"
import BlogPreview from "../components/BlogPreview"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }
  console.log(getSrc(posts[0].frontmatter))
  console.log(getSrc(posts[0].frontmatter.featuredImage))

  return (
    <Layout location={location} title={siteTitle}>
      <Bio header />

      {posts && posts[0] && (
        <div className="newestBlog">
          <h3>Newest Blog</h3>
          <BlogPreview
            title={posts[0].frontmatter.title}
            linkTo={posts[0].fields.slug}
            description={posts[0].frontmatter.description || posts[0].excerpt}
          />
        </div>
      )}

      {/* <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          console.log(post)
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
                  <small>{post.frontmatter.date}</small>
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
      </ol> */}
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => (
  <Seo title="Mario's blog" description="Stay up with Dev news with Mario" />
)

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          featuredImage {
            childImageSharp {
              gatsbyImageData(
                height: 627
                width: 1200
                placeholder: BLURRED
                transformOptions: { fit: CONTAIN }
                layout: FIXED
              )
            }
          }
        }
      }
    }
  }
`
