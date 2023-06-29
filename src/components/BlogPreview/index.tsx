import React from "react"
const css = require("./index.module.css")

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
      <a href={linkTo} target="_blank" className={css.header}>
        {title}
      </a>

      <p className={css.description}>{description}</p>
      <a className={css.link} href={linkTo} target="_blank">
        Read More
      </a>
    </div>
  )
}
