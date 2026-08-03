import * as React from "react"
import { HeadProps } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => {
  return (
    <Layout>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  )
}

export const Head: React.FC<HeadProps> = ({ location }) => (
  <Seo
    title="404: Not Found"
    description="The requested page could not be found."
    pathname={location.pathname}
    noIndex
  />
)

export default NotFoundPage
