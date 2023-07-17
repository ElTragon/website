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
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="someone@hotmail.com"
              required
            />
          </div>
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your message:
          </label>
          <textarea
            id="message"
            rows={4}
            cols={25}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Leave a message.."
          />
          <button>Send</button>
        </form>
    </>
  )
}
