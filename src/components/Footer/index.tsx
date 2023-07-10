import * as React from "react"
import Icon from "../Icons/icon"
const css = require("./index.module.css")

type SocialLinkType = {
  linkTo: string
  url: string
}

const socialLinks: SocialLinkType[] = [
  { linkTo: "twitter", url: `https://twitter.com/guythatcodes` },
  { linkTo: "github", url: `https://github.com/ElTragon` },
  {
    linkTo: "linkedin",
    url: `https://www.linkedin.com/in/mario-lopez-644b1ab4/`,
  },
]
const Footer = () => {
  return (
    <footer>
      <div className={css.socialLinkContainer}>
        {socialLinks.map(socialLink => {
          return (
            <a
              className={css.socialLink}
              key={socialLink.linkTo}
              href={socialLink.url}
            >
              <Icon name={socialLink.linkTo} />
            </a>
          )
        })}
      </div>
      <div className={css.builtByContainter}>
        © {new Date().getFullYear()}, Built by
        {` `}
        <a className={css.link} href="https://github.com/ElTragon">
          Mario Lopez
        </a>
      </div>{" "}
    </footer>
  )
}

export default Footer
