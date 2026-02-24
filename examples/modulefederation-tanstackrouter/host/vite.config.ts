import { federation } from "@module-federation/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";
import { setupUniformServer } from "@repo/uniform-preview/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    server: {
      cors: true,
    },
    plugins: [
      react(),
      TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
      {
        name: "uniform-server",
        configureServer(server) {
          setupUniformServer(server, {
            projectId: env.VITE_UNIFORM_PROJECT_ID,
            apiKey: env.UNIFORM_API_KEY,
            apiHost: env.UNIFORM_API_HOST,
            edgeApiHost: env.UNIFORM_EDGE_API_HOST,
          });
        },
      },
      federation({
        name: "host",
        manifest: true,
        shared: Object.fromEntries(
          ["react", "react-dom", "@tanstack/react-router", "@uniformdev/canvas", "@uniformdev/canvas-react"].map((pkg) => [
            pkg,
            { singleton: true },
          ])
        ),
      }),
    ],
    build: {
      target: "chrome89",
    },
  };
});
