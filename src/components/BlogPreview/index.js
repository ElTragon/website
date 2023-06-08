import css from "./index.module.css"

export default function BlogPreview({
  title,
  description,
  date,
  imagePath,
  linkTo,
}) {
  return (
    <div className={css.container}>
      {/* {imagePath} */}

      <h1>{title}</h1>

      <p>{description}</p>

      <a className={css.link} href={linkTo} target="_blank">
        Read More
      </a>
    </div>
  )
}
