import React from "react"
import IconGitHub from "./github"
import IconLinkedin from "./linkedin"
import IconTwitter from "./twiiter"
import IconCopy from "./copy"

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
    case "copy":
      return <IconCopy />
    default:
      return <IconGitHub />
  }
}

export default Icon
