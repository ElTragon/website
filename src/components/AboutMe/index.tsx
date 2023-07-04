import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
const css = require("./index.module.css")

const leftTech = ["Javascript", "Typescript", "React"]

const rightTech = ["NextJs", "Gastby", "Node.Js"]

type Props = {
  technologies: string[]
}

const ListTech = ({ technologies }: Props) => {
  return (
    <ul className={css.techContainer}>
      {technologies.map(tech => {
        return (
          <li>
            <span className={css.tech}>{tech}</span>
          </li>
        )
      })}
    </ul>
  )
}

const AboutMe = () => {
  return (
    <div className={css.container}>
      <h3 className={css.header}>About Me</h3>

      <p className={css.text}>
        Hello! I'm Mario Lopez, a software engineer from California. With
        experience at startups, database, pharmaceutical, and fintech companies,
        I've honed my skills in React, TypeScript, Go, and more. I'm passionate
        about creating accessible and innovative solutions. Let's connect and
        collaborate on exciting projects!
      </p>

      <div className={css.listContainer}>
        <ListTech technologies={leftTech} />
        <ListTech technologies={rightTech} />
      </div>
    </div>
  )
}

export default AboutMe
