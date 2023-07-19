import * as React from "react"
import { IoIosClose } from "react-icons/io"
const css = require("./index.module.css")

type Props = {
  onClick: () => void
  logoSrc: string
  children: JSX.Element
}

const doubleSize = 28

const Overlay = ({ onClick, logoSrc, children }: Props) => {
  return (
    <div className={css.container}>
      <div className={css.iconContainer}>
        <img
          src={logoSrc}
          alt="logo"
          style={{ width: "30px", height: "30px" }}
        />
        <button className={css.closeButton} onClick={onClick}>
          <IoIosClose size={doubleSize} />
        </button>
      </div>

      {children}
    </div>
  )
}

export default Overlay
