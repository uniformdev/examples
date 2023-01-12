## Getting Started with Uniform in Gatsby.js

In this tutorial, you'll learn the basics of creating a digital experience Uniform by building a SaaS landing page with Gatsby and a CMS, Sanity. This tutorial covers the fundamentals of composing a page in Gatsby, using data from Sanity in Uniform.
You'll learn to personalize elements in your website and leverage Uniform's Contextual editing capabilities to build your pages faster.

### Outline

- Why Uniform
- Who is this for
- What you'll build
- Scaffolding a Sanity application
  - Setup schemas with content
- Creating a Uniform account and application, Create API key.
- Source content requirements and design considerations
- Create components on Uniform. Remove Hello World components
  - Add sanity integration
  - Add sanity content type as a parameter for the components
- Create an empty composition for the home page
- Create Gatsby application
  - Install dependencies and prerequisites (Tailwind, Uniform, Gatsby CLI). Ensure package match
  - Add environment variables
  - Setup Components on Gatsby to match Uniform components - Use Dummy data if you have to
- Fill up composition in Uniform, with content to match the structure in the website
- Connect Uniform composition by Slug for each page
  - Fetch composition in Gatsby SSR using `serverData`.
  - Add enhancer for Sanity. Modify enhancer to manage images
  - Create resolve renderer
  - Add named Slots for child components
  - Add preview hook for contextual editing including enhance function to manage visual canvas enhancement
- Setup Preview in Uniform
  - Add preview URL in Uniform canvas
  - Add localhost domain in Sanity API settings to avoid CORS errors in the dashboard
- Install Uniform Context
- Update Script to fetch manifest file
- Instantiate context in Gatsby browser and Gatsby-ssr, using manifest. Update tsconfig.json to allow JSON reads.
- Re-run Gatsby dev server.
- Setup Signal in Uniform
- Add a Personalized component in Canvas
- Deploy project
- Test personalization with Uniform Chrome extension.
- Common errors
  - `<Personalize/>` should be used in a composition
  - Unpublished composition and manifest
  - Version mismatch
  - Adding API keys in deployment
  - Uniform injects a wrapper `div` when you pass a `Slot` can mess up your UI if you use grid systems.
- Next steps
  - Setup more pages.
  - Use project map to manage site structure and navigation menu.
  - Explore creating a gatsby-source-plugin to add composition data to Gatsby's data layer.
  - Use Gatsby's filesystem routing to handle dynamic pages
  - Handle slug redirects for other pages in gatsby's `serverData` function to manage contextual editing when a slug is passed.
  - Edge-side personalization
  - Replace enhancers with Next-gen mesh integration
