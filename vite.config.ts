import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import { Plugin } from "vite";
import { handleApiRequest } from "./src/lib/server/apiRouter";

const apiServerPlugin = (): Plugin => ({
  name: "portfolio-api-server",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url && req.url.startsWith("/api/")) {
        const handled = await handleApiRequest(req, res);
        if (handled) return;
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url && req.url.startsWith("/api/")) {
        const handled = await handleApiRequest(req, res);
        if (handled) return;
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), apiServerPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
