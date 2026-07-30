import * as React from "react"
import { graphql, Link, PageProps } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

interface NotFoundPageData {
  site: {
    siteMetadata: {
      title: string
    }
  }
}

const ThanksPage: React.FC<PageProps<NotFoundPageData>> = ({
  data,
  location,
}) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout>
      <h1>Thank you</h1>
      <p>Your message has been sent.</p>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export const Head: React.FC = () => (
  <Seo
    title="Thank you"
    description={"Thank you, but it's weird to send this page in a link."}
  />
)

export default ThanksPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
