import type { ReactNode } from "react"
import { IoIosClose } from "react-icons/io"
import css from "./index.module.css"

type Props = {
  onClick: () => void
  logoSrc: string
  children: ReactNode
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
        <button
          type="button"
          className={css.closeButton}
          onClick={onClick}
          aria-label="Close navigation menu"
        >
          <IoIosClose size={doubleSize} />
        </button>
      </div>

      {children}
    </div>
  )
}

export default Overlay
