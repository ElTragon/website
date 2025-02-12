import React, { useEffect, useState } from "react"
import IconCopy from "../Icons/copy"

const css = require("./index.module.css")

export default function ContactMe() {
  const [success, setSuccess] = useState(false)

  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      setSuccess(true)
      return true
    } catch (err) {
      console.error("Failed to copy text: ", err)
      return false
    }
  }

  function waitTwoSeconds(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 2000))
  }

  async function popUpLogic(): Promise<boolean> {
    try {
      await waitTwoSeconds()
      setSuccess(false)
      return true
    } catch (err) {
      console.error("Failed to copy text: ", err)
      return false
    }
  }

  useEffect(() => {
    if (success == true) {
      popUpLogic()
    }
  }, [success])
  return (
    <>
      <h3 className={css.contactMe}>Contact Me</h3>

      <div className={css.text}>
        My inbox is always open. Whether you have a question or just want to say
        hi. I'll try my best to get back to you.
      </div>

      <div
        className={css.email}
        onClick={() => copyToClipboard("m9lopeztri@gmail.com")}
      >
        m9lopeztri@gmail.com
        <button>
          <IconCopy />
        </button>
      </div>

      <div className={`${css.popup} ${!success ? css.hide : ""}`}>
        m9lopeztri@gmail.com was copied
      </div>
    </>
  )
}
