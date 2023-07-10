import React from "react"
import IconGitHub from "./github"
import IconLinkedin from "./linkedin"
import IconTwitter from "./twiiter"

type Props = {
  name: string
}

const Icon = ({ name }: Props) => {
  switch (name) {
    case "github":
      return <IconGitHub />
    case "linkedin":
      return <IconLinkedin />
    case "twitter":
      return <IconTwitter />
    default:
      return <IconGitHub />
  }
}

export default Icon
