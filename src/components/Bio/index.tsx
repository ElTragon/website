import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
const css = require("./index.module.css")

type Props = {
  header?: boolean
}

const Bio = ({ header }: Props) => {
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
      <p className={css.pretext}>{header ? "It's-a me" : "Made by"}</p>
      <h1 className={css.header}>Mario Lopez</h1>

      {header && <h2 className={css.tagLine}>Handyman for the web</h2>}

      {!header && (
        <div className={css.contactContainer}>
          Handyman for the web{" "}
          <a href="/#contact" className={css.contactLink}>
            Let's get in touch
          </a>
        </div>
      )}
    </div>
  )
}

export default Bio
