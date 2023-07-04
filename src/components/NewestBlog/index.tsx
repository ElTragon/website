import * as React from "react"
import BlogPreview from "../BlogPreview"
const css = require("./index.module.css")

type Props = {
  title: string
  linkTo: string
  description: string
}

const NewestBlog = (props: Props) => {
  return (
    <>
      <h3 className={css.header}>Newest Blog</h3>
      <BlogPreview {...props} />
    </>
  )
}

export default NewestBlog
