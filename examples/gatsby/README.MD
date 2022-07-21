# Uniform starter for Gatsby
Quick starter to get going with Gatsby and Uniform Canvas (composition management) + Uniform Context (personalization).

## What is inside?

- Gatbsy source plugin, which exposes Uniform Canvas compositions within the Gatsby schema.
- UniformConf sample site wired up with the plugin

## Getting started

1. `cd uniform-source-plugin` and `npm install`
1. `cd uniformconf-gatsby`
1. Create .env file with Uniform API key and Uniform Project Id (see `.env.example`)
    ```
    UNIFORM_API_KEY=...
    UNIFORM_PROJECT_ID=...
    ```
2. `npm install`
3. `npm run develop` for local development.
4. `npm run build` to run production build.
5. Open `http://localhost:8000/home`

## Limitations
1. Data enhancing is not wired up yet. Should be easy enough to add within the source plugin.
2. The compositions with slug set to `/` are rewritten as `/home`. This is because the dynamic page data population mechanism in Gatsby doesn't seem to work on the index page. Use edge rewrites from `/` to `/home`. See the netlify.toml file as example:
   ```
   [[redirects]]
    from = "/"
    to = "/home"
    status = 200
    force = true
    ```

## Connect to your own project
1. Create your own project on https://uniform.app.
2. Pick the "Jamstack marketing site starter".
3. Skip deployment.
4. Create the API key and copy paste it within the .env file along with your project id.
5. Re-start the app.

## Deploy

With Netlify, simply run `netlify deploy --build --prod` (considering you have the Netlify CLI installed).