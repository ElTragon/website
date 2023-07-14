---
title: "Gastby: Need some anchors"
date: "2023-07-13T22:12:03.284Z"
description: "A quick tutorial on how to add anchors to your gatsby blog with simple step-by-step instructions and working code example"
featuredImage: "anchorImage.png"
---

TLDR: You just need to run the following:
```bash
    npm install gatsby-remark-autolink-headers
```
Then just follow Gatsby Documtaion here: [gatsby-remark-autolink-headers](https://www.gatsbyjs.com/plugins/gatsby-remark-autolink-headers/)

# Why should you do this

 Making this change is only good if you think the user will want to share a section of blog. Beyond this, there are no other real reason why would should add this it your site.

# Simple change

Like the documetion says here:  [gatsby-remark-autolink-headers](https://www.gatsbyjs.com/plugins/gatsby-remark-autolink-headers/)

You just need to make the following change:

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    // ...some other imports
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-mermaid`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: `100`,
              icon: `<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" fill="#359279" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
              className: `custom-class`,
              maintainCase: true,
              removeAccents: true,
              isIconAfterHeader: true,
              elements: [`h1`, `h2`, `h3`, `h4`], // place the elements you want to anchor here
            },
          },
          `gatsby-remark-prismjs`,
        ],
      },
        // ...some other imports
  ]
```

### Note order does matter
If you are making using of `gatsby-remark-prismjs` then `gatsby-remark-autolink-headers` must come before it. Else you can just huck it in your options for `gatsby-transformer-remark`.

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
     // ...some other imports
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-autolink-headers`],
      },
    },
    // ...some other imports
  ],
}
```

## Some "Gotchas"

For thoses new to [gatsby](https://www.gatsbyjs.com/), any time you edit the `gatsby-config.js` file then you need to build the site again. Then the anchor should pop up only on blogs genertaed from markdown files any time you hover over anything defined in elements. 

If you used a custom css on your site, the anchor could just blend into your background. To address this just change `fill="#359279"` in the svg to any color. Not gonna lie, I was stuck do to this for longer than I want admit.

If you want to me my full implementation of this site, then just click here: [Mario's website repo](https://github.com/ElTragon/website)

# Done

A nice simple change to your site to help users share blogs. I find gatsby plugins a bit finicky from time to time, so stay tuned for more blogs about my misadventures with gatsby.