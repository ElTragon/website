import React from "react"
const css = require("./index.module.css")

type Props = {
  title: string
  description: string
  imagePath: string
  linkTo: string
  tagLine?: string
}

export default function BlogPreview({
  title,
  description,
  imagePath,
  linkTo,
  tagLine,
}: Props) {
  return (
    <div className={css.container}>
      {/* {imagePath} */}

      <img
        src={imagePath}
        alt="coolMeme"
        style={{ width: "300px", height: "225px" }}
      />
      <div className={css.flexContainer}>
        <div className={css.header}>{title}</div>

        <p className={css.description}>{description}</p>
        <a className={css.link} href={linkTo} target="_blank">
          Read More
        </a>
      </div>
    </div>
  )
}
