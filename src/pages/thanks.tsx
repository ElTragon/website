import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const ThanksPage: React.FC = () => {
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
    description="Your message has been sent."
    pathname="/thanks/"
    noIndex
  />
)

export default ThanksPage
