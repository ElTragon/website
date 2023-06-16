import * as React from "react"
import { useState } from "react"
import { IoIosMenu } from "react-icons/io"
const css = require("./index.module.css")

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
    <button className={css.menuButton} onClick={onClick}>
      <IoIosMenu size={doubleSize} />
    </button>
  )
}

const Menu = ({ onClick }: MenuProps & Props) => {
  return (
    <div className={css.menuContainer}>
      <MenuButton onClick={onClick} />
    </div>
  )
}

const MobileNav = ({ logoSrc }: Props) => {
  const [openMenu, setOpenMenu] = useState(false)

  const onClick = () => setOpenMenu(prev => !prev)

  if (openMenu) {
    return <Menu onClick={onClick} logoSrc={logoSrc} />
  }

  return (
    <div className={css.container}>
      <MenuButton onClick={onClick} />
    </div>
  )
}

export default MobileNav
