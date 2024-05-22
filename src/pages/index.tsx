import * as React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/Bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AboutMe from "../components/AboutMe"
import NewestBlog from "../components/NewestBlog"
import ContactMe from "../components/ContactMe"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

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
      <Bio header />

      {posts && posts[0] && (
        <NewestBlog
          title={posts[0].frontmatter.title}
          linkTo={posts[0].fields.slug}
          description={posts[0].frontmatter.description || posts[0].excerpt}
        />
      )}

      <AboutMe />

      <ContactMe />
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
