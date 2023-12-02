import React from "react"
const css = require("./index.module.css")
import { Link } from "gatsby"

type Props = {
  title: string
  description: string
  linkTo: string
  tagLine?: string
}

export default function BlogPreview({
  title,
  description,
  linkTo,
  tagLine,
}: Props) {
  return (
    <div className={css.container}>
      <Link className={css.header} to={linkTo} target="_blank">
        {title}
      </Link>

      <p className={css.description}>{description}</p>
      <Link className={css.link} to={linkTo} target="_blank">
        Read More
      </Link>
    </div>
  )
}
