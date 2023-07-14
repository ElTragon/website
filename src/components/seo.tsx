/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { getSrc } from "gatsby-plugin-image"

const baseURL = "https://mariolopezdev.com"

type Props = {
  title: string
  description: string
  imagePath?: string
  children?: JSX.Element
}

const Seo = ({ description, title, children, imagePath }: Props) => {
  const { site, logo } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            social {
              twitter
            }
          }
        }
        logo: file(relativePath: { eq: "logo.png" }) {
          childImageSharp {
            fixed(height: 800, width: 800) {
              src
            }
          }
        }
      }
    `
  )

  const defaultImage = logo.childImageSharp.fixed.src
  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={baseURL + defaultImage} />
      <meta name="twitter:image" content={baseURL + defaultImage} />

      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:creator"
        content={site.siteMetadata?.social?.twitter || ``}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="../images/favicon_io/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="../images/favicon_io/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="../images/favicon_io/favicon-16x16.png"
      />
      <link rel="manifest" href="../images/favicon_io/site.webmanifest"></link>
      {children}
    </>
  )
}

export default Seo
