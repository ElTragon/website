import DeskTopNav from "./DeskTopNav"
import MobileNav from "./MobileNav"
import css from "./index.module.css"

type Props = {
  logoSrc: string
}

const NavBar = ({ logoSrc }: Props) => {
  return (
    <>
      <div className={css.desktopNav}>
        <DeskTopNav logoSrc={logoSrc} />
      </div>
      <div className={css.mobileNav}>
        <MobileNav logoSrc={logoSrc} />
      </div>
    </>
  )
}

export default NavBar
