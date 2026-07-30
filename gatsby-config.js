/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
require("dotenv").config({
  path: `.env`,
})
const {
  BLOG_INDEX_PATH,
  compareBlogPostsDescending,
  toAbsoluteUrl,
} = require("./src/utils/blog-routes")
const site = `https://mariolopezdev.com/`
const googleTrackingId = process.env.GATSBY_G_TRACKING_ID?.trim()
const includeRoutingFixture = process.env.GATSBY_ROUTING_FIXTURE === `1`

module.exports = {
  trailingSlash: "always",
  siteMetadata: {
    title: `Mario's blog`,
    author: {
      name: `Mario Lopez`,
      summary: `a full stack engineer building cool stuff.`,
    },
    description: `Follow this blog to stay up to date on programming news and learn new stuff.`,
    siteUrl: site,
    social: {
      twitter: `https://twitter.com/guythatcodes`,
      github: `https://github.com/ElTragon`,
      linkedin: `https://www.linkedin.com/in/mario-lopez-644b1ab4/`,
    },
  },
  plugins: [
    `gatsby-plugin-robots-txt`,
    `gatsby-plugin-netlify`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-image`,
    ...(googleTrackingId
      ? [
          {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
              // You can add multiple tracking ids and a pageview event will be fired for all of them.
              trackingIds: [googleTrackingId],
              // This object gets passed directly to the gtag config command
              // This config will be shared across all trackingIds
              gtagConfig: {
                optimize_id: "OPT_CONTAINER_ID",
                anonymize_ip: true,
                cookie_expires: 0,
              },
              // This object is used for configuration specific to this plugin
              pluginConfig: {
                // Puts tracking script in the head instead of the body
                head: true,
                // Setting this parameter is also optional
                respectDNT: true,
                // Defaults to https://www.googletagmanager.com
                origin: "https://www.googletagmanager.com",
                // Delays processing pageview events on route update (in milliseconds)
                delayOnRouteUpdate: 0,
              },
            },
          },
        ]
      : []),
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allMarkdownRemark(
            filter: {fields: {isBlog: {eq: true}}}
            sort: {frontmatter: {date: DESC}}
          ) {
            nodes {
              fields {
                slug
              }
              frontmatter {
                title
                date       
              }
            }
          }
        }
      `,
        resolveSiteUrl: () => site,
        resolvePages: ({ allMarkdownRemark: { nodes: mdxs } }) => {
          const sortedPosts = [...mdxs].sort(compareBlogPostsDescending)
          const posts = sortedPosts.map(mdx => {
            return {
              path: mdx.fields.slug,
              ...(mdx.frontmatter.date
                ? { lastmod: mdx.frontmatter.date }
                : {}),
              changefreq: "never",
              priority: 0.7,
            }
          })

          const latestPostDate = sortedPosts[0]?.frontmatter.date

          const home = {
            path: "/",
            ...(latestPostDate ? { lastmod: latestPostDate } : {}),
            changefreq: "weekly",
            priority: 0.3,
          }

          const blog = {
            path: BLOG_INDEX_PATH,
            ...(latestPostDate ? { lastmod: latestPostDate } : {}),
            changefreq: "weekly",
            priority: 0.3,
          }

          return [...posts, home, blog]
        },
        serialize: ({ path, lastmod, changefreq, priority }) => {
          return {
            url: path,
            lastmod,
            changefreq,
            priority,
          }
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    ...(includeRoutingFixture
      ? [
          {
            resolve: `gatsby-source-filesystem`,
            options: {
              path: `${__dirname}/tests/fixtures/blog`,
              name: `blog`,
            },
          },
        ]
      : []),
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
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
              elements: [`h1`, `h2`, `h3`, `h4`],
            },
          },
          `gatsby-remark-prismjs`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return [...allMarkdownRemark.nodes]
                .sort(compareBlogPostsDescending)
                .map(node => {
                  const postUrl = toAbsoluteUrl(
                    site.siteMetadata.siteUrl,
                    node.fields.slug
                  )

                  return Object.assign({}, node.frontmatter, {
                    description: node.excerpt,
                    date: node.frontmatter.date,
                    url: postUrl,
                    guid: postUrl,
                    custom_elements: [{ "content:encoded": node.html }],
                  })
                })
            },
            query: `{
              allMarkdownRemark(
                filter: {fields: {isBlog: {eq: true}}}
                sort: {frontmatter: {date: DESC}}
              ) {
                nodes {
                  excerpt
                  html
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                    date
                    featuredImage {
                      childImageSharp {
                        gatsbyImageData(
                          height: 627
                          width: 1200
                          placeholder: BLURRED
                          transformOptions: { fit: CONTAIN }
                          layout: FIXED
                        )
                      }
                    }                  
                  }
                }
              }
            }`,
            output: "/rss.xml",
            title: "Mario Blog Feed",
            match: `^${BLOG_INDEX_PATH}`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mario's Blog`,
        short_name: `Blog`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon_io/favicon-32x32.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
