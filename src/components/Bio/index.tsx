import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
const css = require("./index.module.css")

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

  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social // use later

  return (
    <div className={css.container}>
      <p className={css.pretext}>It's-a me</p>
      <h1 className={css.header}>Mario Lopez</h1>

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
