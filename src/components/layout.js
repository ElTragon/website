import * as React from "react"
import { Link } from "gatsby"
import "../global.css"
import NavBar from "./NavBar"
import Footer from "./Footer"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="layout-wrapper">
      <NavBar />

      <div className="global-wrapper" data-is-root-path={isRootPath}>
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
