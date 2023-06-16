import * as React from "react"
import { Link } from "gatsby"
import { NavLinks } from "../constants"
const css = require("./index.module.css")

type Props = {
  logoSrc: string
}

const DeskTopNav = ({ logoSrc }: Props) => {
  return (
    <div className={css.container}>
      <img src={logoSrc} alt="logo" style={{ width: "30px", height: "30px" }} />

      <div className={css.links}>
        {NavLinks.map((link, i) => (
          <Link key={i} className={css.link} to={link.routeTo}>
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DeskTopNav
