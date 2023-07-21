import * as React from "react"
import { NavLinks } from "../constants"
const css = require("./index.module.css")

type Props = {
  logoSrc: string
}

const DeskTopNav = ({ logoSrc }: Props) => {
  return (
    <div className={css.container}>
      <img src={logoSrc} alt="logo" className={css.logo} />

      <div className={css.links}>
        {NavLinks.map((link, i) => (
          <a key={i} className={css.link} href={link.routeTo}>
            <span className={css.number}>0{i}. </span>

            {link.name}
          </a>
        ))}
      </div>
    </div>
  )
}

export default DeskTopNav