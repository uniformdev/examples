# Next.js App Router starter for Context


> ⚠️ This starter is using older version of Next.js SDK and is deprecated in favor of [v2](../nextjs-app-router-v2/).

This starter is based on the [Next.js App Router starter](https://github.com/vercel/nextjs-app-router-starter) and adds the Uniform Context SDK to the project (personalization and A/B testing only), without the Canvas SDK.

> For sample demo content, this starter uses mocked content in a json object. If you integrate with a headless CMS, you will need to replace the mocked content with your own data fetching logic using the relevantCMS SDK.

## Pre-requisites

1. Uniform account with an empty project.

## Getting Started

1. Install dependencies with `npm install`
1. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser and notice "Default Title" in the page.

For this example, the Hero component is personalized based on the "developers" signal. This signal is firing if you have "?utm_audience=developers" in the URL. Therefore, to see personalized content, simply add this to the URL:

```
http://localhost:3000/?utm_audience=developers
```

You should see "Personalized for Developers" in the page.

## How does this work?

This starter is using Uniform Context SDK for React to run personalization and A/B testing.
The components inside the `uniform` folder are the ones that are using the Uniform Context SDK and are adapters ready to be used within Next.js App Router:

1. The `UniformContext` component is a server component that retrieves the manifest from the Uniform API and passes it to the `ClientUniformContext` component.
2. The `ClientUniformContext` component is a client component that uses the manifest to personalize the content.
3. The `Personalize` component is a client component wrapper over the `Personalize` component from the Uniform Context SDK for React that is used to personalize the content.

Copy these components to your project if you are not starting with this starter.

Besides these components, the following is a must-have if you are porting this over your Next.js App Router project. See `layout.tsx` is the main layout of the app that is using the `UniformContext` component wrapping the whole app. This is important to activate the Uniform Context SDK. You will need to wrap your layout with the `UniformContext` component as well:

```tsx
import { UniformContext } from "@/uniform/UniformContext";
...
<UniformContext>
  <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </body>
  </html>
</UniformContext>
```

The rest of the components are demo components that are not critical to the Uniform Context SDK:

1. The page.tsx is the page handler that places a demo Hero component on the page. It fetches hero data from the `fetchHeroData` function using mocked content. If you integrate with a headless CMS, you will need to replace this function with your own data fetching logic using the relevantCMS SDK.
2. The `PersonalizedHero` component is the wrapping component that is using the `Personalize` component to personalize the Hero component. It simply passes the array of mocked variations to the `Personalize` component and the name of the personalization along with the instance of the Hero component used to render the active variation.

```tsx
<UniformPersonalize
  variations={variations}
  name="heroPersonalized"
  component={Hero}
/>
```

### Additional parts to consider

This starter also includes the Uniform Sync CLI to push content from disk to your Uniform project and pull content from your Uniform project to disk. This is optional but typically recommended for production projects. To add this to your project, run the following command:

```bash
npm install @uniformdev/cli --save-dev
```

> Make sure you are using the same package version as the rest of the `@uniformdev`` packages in your project.

Copy the three npm scripts from the `package.json` file to your project:

```json
"scripts": {
  "uniform:push": "uniform sync push",
  "uniform:pull": "uniform sync pull",
  "uniform:publish": "uniform sync publish"
}
```

## (Optional) Deploy to your empty project

This app can run agains a pre-deployed Uniform project. The `uniform-data` folder is the folder that is used to store and configuration for the demo, intended to be pushed to your Uniform project.

If you want to deploy to your empty project, follow these steps:

1. Change the API key and Project ID env vars in `.env` with your own.
   > Make sure your API key has "Developer" role to be able to push content.
1. `npm run uniform:push` to push content from disk (`/uniform-data` folder) to your project.
1. `npm run uniform:publish` to publish the manifest with personalization configuration.
1. `npm run dev` to run the app.
