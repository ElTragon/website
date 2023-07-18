import React from "react"
const css = require("./index.module.css")

export default function ContactMe() {
  return (
    <>
      <h3 className={css.contactMe}>Contact Me</h3>
        <form
          name="contact-form"
          method="post"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          className={css.container}
        >
          <div className="mb-6">
            <label
              htmlFor="email"
              className={css.label}
            >
              Your email:
            </label>
            <input
              type="email"
              id="email"
              className={css.inputEmail}
              placeholder="someone@hotmail.com"
              required
            />
          </div>
          <label
            htmlFor="message"
            className={css.label}
            >
            Your message:
          </label>
          <textarea
            id="message"
            rows={4}
            cols={25}
            className={css.inputMessage}
            placeholder="Leave a message.."
          />
          <button className={css.sendButton}>Send</button>
        </form>
    </>
  )
}
