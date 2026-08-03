import css from "./index.module.css"

type Props = {
  title: string
  description: string
  linkTo: string
}

export default function BlogPreview({ title, description, linkTo }: Props) {
  return (
    <div className={css.container}>
      <a className={css.header} href={linkTo}>
        {title}
      </a>

      <p className={css.description}>{description}</p>
      <a className={css.link} href={linkTo}>
        Read More
      </a>
    </div>
  )
}
