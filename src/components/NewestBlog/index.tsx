import BlogPreview from "../BlogPreview"
import css from "./index.module.css"

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
