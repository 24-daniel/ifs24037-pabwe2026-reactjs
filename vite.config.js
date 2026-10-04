import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

// Menyisipkan CSS hasil build ke index.html agar tidak memblokir render (Lighthouse: render-blocking).
function inlineCss() {
  return {
    name: "inline-css",
    apply: "build",
    enforce: "post",
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;
      let out = html;
      for (const [file, asset] of Object.entries(ctx.bundle)) {
        if (!file.endsWith(".css") || asset.type !== "asset") continue;
        const name = file.split("/").pop().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        out = out.replace(new RegExp(`<link[^>]*href="[^"]*${name}"[^>]*>`), `<style>${asset.source}</style>`);
        delete ctx.bundle[file];
      }
      return out;
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl =
    env.DELCOM_BASEURL || env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";
  return {
    plugins: [react(), tailwindcss(), inlineCss()],
    server: { port: Number(env.APP_PORT) || 3000 },
    preview: { port: Number(env.APP_PORT) || 3000 },
    define: { DELCOM_BASEURL: JSON.stringify(baseUrl) },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,jsx}"],
        exclude: ["src/main.jsx", "src/setupTests.js", "src/test-utils.jsx", "**/*.test.{js,jsx}", "node_modules/**"],
        thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
      },
    },
  };
});
