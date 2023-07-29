import * as React from "react"
import DeskTopNav from "./DeskTopNav"
import MobileNav from "./MobileNav"
import { graphql, useStaticQuery } from "gatsby"
const css = require("./index.module.css")

const NavBar = () => {
  const { logo } = useStaticQuery(
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

  const logoSrc = (logo.childImageSharp.fixed.src as string) || ""

  return (
    <>
      <div className={css.desktopNav}>
        <DeskTopNav logoSrc={logoSrc} />
      </div>
      <div className={css.mobileNav}>
        <MobileNav logoSrc={logoSrc} />
      </div>
    </>
  )
}

export default NavBar
