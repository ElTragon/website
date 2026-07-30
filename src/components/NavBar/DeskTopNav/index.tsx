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
      <img src={logoSrc} alt="logo" className={css.logo} />

      <div className={css.links}>
        {NavLinks.map((link, i) => {
          const content = (
            <>
              <span className={css.number}>0{i}. </span>
              {link.name}
            </>
          )

          return link.isDocument ? (
            <a key={link.routeTo} className={css.link} href={link.routeTo}>
              {content}
            </a>
          ) : (
            <Link key={link.routeTo} className={css.link} to={link.routeTo}>
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default DeskTopNav
