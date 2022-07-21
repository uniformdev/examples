/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */
require("dotenv").config({
  path: `.env`,
})

module.exports = {
  plugins: [
    {
      resolve: `../uniform-source-plugin`,
      options: {
        uniformApiKey: process.env.UNIFORM_API_KEY,
        uniformProjectId: process.env.UNIFORM_PROJECT_ID,
      },
    },
  ],
}
