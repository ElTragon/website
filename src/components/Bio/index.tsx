import css from "./index.module.css"

type Props = {
  header?: boolean
}

const Bio = ({ header }: Props) => {
  return (
    <div className={css.container}>
      <p className={css.pretext}>{header ? "It's-a me" : "Made by"}</p>
      <h1 className={css.header}>Mario Lopez</h1>

      {header && <h2 className={css.tagLine}>Handyman for the web</h2>}

      {!header && (
        <div className={css.contactContainer}>
          Handyman for the web{" "}
          <a href="/#contact" className={css.contactLink}>
            Let's get in touch
          </a>
        </div>
      )}
    </div>
  )
}

export default Bio
