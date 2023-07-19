import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <h1>Thank you</h1>
      <p>Your message has been sent.</p>
      <a href={"/"} target="_blank">
        Go back to the homepage
      </a>
    </Layout>
  )
}

export const Head = () => <Seo title="Thank you" />

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
