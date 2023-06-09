/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
// import "../../global.css"
import * as css from "./index.module.css"
// import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div className={css.container}>
      <p className={css.pretext}>It's a me</p>
      <h1 className={css.header}>Mario Lopez</h1>
      {/* <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif", "png"]}
        src="../../images/profile.png"
        width={50}
        height={50}
        quality={95}
        alt="Profile picture"
      /> */}
      {author?.name && (
        <h2>
          Freelancing full stack engineer. Building pixel perfect web-apps.
          Passionate about programming, running a blog too.
        </h2>
      )}
    </div>
  )
}

export default Bio
