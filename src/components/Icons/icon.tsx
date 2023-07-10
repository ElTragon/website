import React from "react"
import IconGitHub from "./github"
import IconLinkedin from "./linkedin"
import IconTwitter from "./twiiter"

const Icon = ({ name }) => {
  switch (name) {
    case "GitHub":
      return <IconGitHub />

    case "Linkedin":
      return <IconLinkedin />

    case "Twitter":
      return <IconTwitter />
    default:
      return <IconGitHub />
  }
}

export default Icon
