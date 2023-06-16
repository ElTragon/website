import * as React from "react"
import { Link } from "gatsby"
const css = require("./index.module.css")

type Props = {
  logoSrc: string
}

const links = [
  { routeTo: "/", name: "Home" },
  { routeTo: "/blogs", name: "Blogs" },
]

const DeskTopNav = ({ logoSrc }: Props) => {
  console.log(logoSrc)
  return (
    <div className={css.container}>
      <img src={logoSrc} alt="logo" style={{ width: "30px", height: "30px" }} />

      <div className={css.links}>
        {links.map((link, i) => (
          <Link key={i} className={css.link} to={link.routeTo}>
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DeskTopNav
