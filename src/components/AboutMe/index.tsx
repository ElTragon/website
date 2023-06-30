import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
const css = require("./index.module.css")

const technologies = [
  "Javascript",
  "Typescript",
  "React",
  "NextJs",
  "Gastby",
  "Node.Js",
]

const AboutMe = () => {
  return (
    <div className={css.container}>
      <h2>About Me</h2>

      <p>
        Hello! I'm Mario Lopez, a software engineer from California. With
        experience at startups, database, pharmaceutical, and fintech companies,
        I've honed my skills in React, TypeScript, Go, and more. I'm passionate
        about creating accessible and innovative solutions. Let's connect and
        collaborate on exciting projects!
      </p>

      <ul>
        {technologies.map(tech => {
          return <li>{tech}</li>
        })}
      </ul>
    </div>
  )
}

export default AboutMe
