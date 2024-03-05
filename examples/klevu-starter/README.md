## Getting Started

1. Copy `.env.example` to `.env`

1. Define environment variables:
    - `UNIFORM_PROJECT_ID`
    - `UNIFORM_API_KEY`
    - `KLEVU_SEARCH_URL_HOST`
    - `KLEVU_SEARCH_API_KEY`

1. Run `npm install`

1. Push Uniform content to a project:
    ```bash
    npm run uniform:sync:push
    ```

1. Run the development server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.