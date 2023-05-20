require("dotenv").config();

import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `sd-joyride-web`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin.
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-netlify",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-postcss",
     {
    resolve: `gatsby-plugin-gatsby-cloud`,
    options: {
      mergeSecurityHeaders: false,
    },
  },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: `../uniform-source-plugin`,
      options: {
        uniformApiKey: process.env.UNIFORM_API_KEY,
        uniformProjectId: process.env.UNIFORM_PROJECT_ID,
      },
    },
  ],
   developMiddleware: (app) => {
    app.use((req, res, next) => {
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      next();
    });
  },
};

export default config;
