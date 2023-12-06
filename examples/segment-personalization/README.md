# Segment Personalization Starter

This is a [Next.js](https://nextjs.org/) example built with App Router.
The same scenario can be achieved with any front-end application framework supported by Uniform.

## Pre-requisites

1. Uniform account with an empty project.
2. Twilio Engage account with the ability to retrieve connection settings.

## Getting Started

1. Setup Uniform project environment variables:
    ```bash
    UNIFORM_API_KEY=
    UNIFORM_PROJECT_ID=
    ```
1. Setup Segment environment variables:

    ```bash
    NEXT_PUBLIC_ANALYTICS_WRITE_KEY=
    SEGMENT_SPACE_ID=
    SEGMENT_API_KEY=
   ```
1. Install dependencies with `npm install`
2. Change the API key and Project ID env vars in `.env` with your own.
    > Make sure your API key has "Developer" role to be able to push content.
3. `npm run push` and `npm run publish` to push content from disk (`/uniform-data` folder) to your project. 
4. Run the development server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Moving pieces

1. The Segment script registered in `app/layout.tsx` allows to send data to Segment.
2. API route to fetch traits from Segment Profile API, see `/app/api/traits/route.ts`.
3. Front-end component that sets Uniform tracker context client-side: `components/tracker-score-sync/index.tsx`


## Server-side operation

There are multiple options as it comes to fetching Segment data. The default example is using client-side fetch, so you don't block page rendering. You can also do it the blocking way, see `/app/[[...path]]/page.tsx.ssr` as an example of the server-side blocking approach. Naturally, this approach is not compatible with the Static Site Generation mode.

The tradeoff of this approach is that the initial page render will be dependent on the Segment Profile API response, but you get fresh visitor data during page load. If you go with this approach, remove the `<TrackerScoreSync />` component. 

