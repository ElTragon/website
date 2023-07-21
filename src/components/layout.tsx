import * as React from "react"
import { Link, PageProps } from "gatsby"
import "../global.css"
import NavBar from "./NavBar"
import Footer from "./Footer"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <NavBar />

      <div className="global-wrapper">
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
