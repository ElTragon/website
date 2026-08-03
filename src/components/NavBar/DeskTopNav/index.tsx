import { NavLinks } from "../constants"
import css from "./index.module.css"

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

          return (
            <a key={link.routeTo} className={css.link} href={link.routeTo}>
              {content}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default DeskTopNav
