import React from "react"
const css = require("./index.module.css")

import { navigate } from "gatsby-link"

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

export default function ContactMe() {
  const [state, setState] = React.useState({})

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    const form = e.target
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": form.getAttribute("name"),
        ...state,
      }),
    })
      .then(() => navigate(form.getAttribute("action")))
      .catch(error => alert(error))
  }
  return (
    <>
      <h3 className={css.contactMe}>Contact Me</h3>

      <div className={css.text}>
        My inbox is always open. Whether you have a question or just want to say
        hi. I'll try my best to get back to you.
      </div>

      <form
        name="contact-form"
        action="/thanks/"
        method="post"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className={css.container}
      >
        <div className="mb-6">
          <input type="hidden" name="form-name" value="contact" />
          <label htmlFor="email" className={css.label}>
            Your email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={css.inputEmail}
            placeholder="someone@hotmail.com"
            onChange={handleChange}
            required
          />
        </div>
        <label htmlFor="message" className={css.label}>
          Your message:
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          cols={25}
          className={css.inputMessage}
          onChange={handleChange}
          placeholder="Leave a message.."
        />
        <button className={css.sendButton}>Send</button>
      </form>
    </>
  )
}
