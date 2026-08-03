/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { getSrc, IGatsbyImageData } from "gatsby-plugin-image"
import { toAbsoluteUrl } from "../utils/blog-routes"

type Props = {
  title: string
  description?: string
  imagePath?: string
  pathname: string
  type?: "article" | "website"
  datePublished?: string
  noIndex?: boolean
  children?: React.ReactNode
}

type SeoQueryData = {
  site: {
    siteMetadata: {
      title: string
      description: string
      siteUrl: string
      author: {
        name: string
      }
      social: {
        twitterUsername: string
      }
    }
  }
  logo: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
}

const serializeStructuredData = (value: object) =>
  JSON.stringify(value).replace(/</g, "\\u003c")

const Seo = ({
  description,
  title,
  children,
  imagePath,
  pathname,
  type = "website",
  datePublished,
  noIndex = false,
}: Props) => {
  const { site, logo } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
            author {
              name
            }
            social {
              twitterUsername
            }
          }
        }
        logo: file(relativePath: { eq: "logo.png" }) {
          childImageSharp {
            gatsbyImageData(height: 800, width: 800, layout: FIXED)
          }
        }
      }
    `
  ) as SeoQueryData

  const defaultImage = getSrc(logo.childImageSharp.gatsbyImageData)
  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata.title
  const canonicalUrl = toAbsoluteUrl(site.siteMetadata.siteUrl, pathname)
  const socialImageUrl = toAbsoluteUrl(
    site.siteMetadata.siteUrl,
    imagePath || defaultImage || "/favicon.ico"
  )
  const fullTitle =
    title === defaultTitle ? title : `${title} | ${defaultTitle}`
  const structuredData =
    type === "article"
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description: metaDescription,
          url: canonicalUrl,
          mainEntityOfPage: canonicalUrl,
          image: socialImageUrl,
          ...(datePublished ? { datePublished } : {}),
          author: {
            "@type": "Person",
            name: site.siteMetadata.author.name,
            url: site.siteMetadata.siteUrl,
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          description: metaDescription,
          url: canonicalUrl,
          isPartOf: {
            "@type": "WebSite",
            name: defaultTitle,
            url: site.siteMetadata.siteUrl,
          },
        }

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${defaultTitle} RSS Feed`}
        href={toAbsoluteUrl(site.siteMetadata.siteUrl, "/rss.xml")}
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={socialImageUrl} />
      <meta property="og:image:alt" content={`${title} social preview`} />
      {datePublished && (
        <meta property="article:published_time" content={datePublished} />
      )}
      <meta name="twitter:image" content={socialImageUrl} />
      <meta name="twitter:image:alt" content={`${title} social preview`} />

      <meta
        name="twitter:card"
        content={imagePath ? "summary_large_image" : "summary"}
      />
      <meta
        name="twitter:creator"
        content={site.siteMetadata.social.twitterUsername}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <script type="application/ld+json">
        {serializeStructuredData(structuredData)}
      </script>
      {children}
    </>
  )
}

export default Seo
