# Algolia integration starter

This starter is based on Next.js and showcases two main use cases of the Algolia + Uniform integration:

1. Ability to register Algolia components from `react-instantsearch` as Canvas components (see the `/components` folder). After the Algolia integration is installed into your Uniform project, you will see new Algolia components added to your component library. This project contains the sample front-end implementation of those components.

## Pre-requisites

1. **Algolia integration** must be installed in your Uniform project. You can install it from the Integrations page in the Uniform dashboard.
2. Run `npm run uniform:push` to push the sample search page and Algolia components into your Uniform project.

## Getting Started

1. Copy `.env.example` to `.env` and fill in your Uniform and Algolia credentials.
2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the development server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.