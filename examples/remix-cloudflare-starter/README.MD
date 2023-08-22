# Uniform + Remix starter

## Setup

1. `npm install`
2. Create both `.env` and `.dev.env` (see both `.example` files) and provide two env vars to connect to your Uniform project:
    ```
    UNIFORM_API_KEY=
    UNIFORM_PROJECT_ID=
    ```
3. Run `npm run uniform:push` if you are setting up an empty project (in this case `UNIFORM_API_KEY` must have write access to your project or Developer role assigned).

4. Run `npm run uniform:manifest` to download Uniform Context manifest.

5. Run `npm run dev` to start the dev server.