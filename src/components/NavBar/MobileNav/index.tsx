import { useState } from "react"
import { IoIosMenu } from "react-icons/io"
import { NavLinks } from "../constants"
import Overlay from "../../Overlay"
import css from "./index.module.css"

type Props = {
  logoSrc: string
}

type MenuProps = {
  onClick: () => void
}

//https://stackoverflow.com/questions/43768629/how-to-scale-large-font-awesome-icons-from-the-react-icons-package
// Font awesome pixel sizes relative to the multiplier.
// 1x - 14px
// 2x - 28px
// 3x - 42px
// 4x - 56px
// 5x - 70px
const doubleSize = 28
const MenuButton = ({ onClick }: MenuProps) => {
  return (
    <button
      type="button"
      className={css.menuButton}
      onClick={onClick}
      aria-label="Open navigation menu"
    >
      <IoIosMenu size={doubleSize} />
    </button>
  )
}

const MobileNav = ({ logoSrc }: Props) => {
  const [openMenu, setOpenMenu] = useState(false)

  const onClick = () => setOpenMenu(prev => !prev)
  const closeMenu = () => setOpenMenu(false)

  if (openMenu) {
    return (
      <Overlay onClick={onClick} logoSrc={logoSrc}>
        <div className={css.links}>
          {NavLinks.map(link => (
            <a
              key={link.routeTo}
              className={css.link}
              href={link.routeTo}
              onClick={closeMenu}
            >
              {link.name}
            </a>
          ))}
        </div>
      </Overlay>
    )
  }

  return (
    <div className={css.container}>
      <img src={logoSrc} alt="logo" className={css.logo} />
      <MenuButton onClick={onClick} />
    </div>
  )
}

export default MobileNav
