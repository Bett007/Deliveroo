import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

function readEnvExampleToken() {
  const envExamplePath = path.resolve(process.cwd(), ".env.example");
  if (!fs.existsSync(envExamplePath)) {
    return "";
  }

  const raw = fs.readFileSync(envExamplePath, "utf8");
  const lines = raw.split(/\r?\n/);
  const values = {};

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      return;
    }
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    values[key] = value.replace(/^['"]|['"]$/g, "");
  });

  return values.VITE_MAPBOX_ACCESS_TOKEN || values.VITE_MAPBOX_TOKEN || "";
}

export default defineConfig(({ mode }) => {
  const fallbackMapToken = readEnvExampleToken();

  return {
    plugins: [react()],
    envPrefix: ["VITE_", "MAPBOX_"],
    define: {
      __MAPBOX_FALLBACK_TOKEN__: JSON.stringify(fallbackMapToken),
      __APP_MODE__: JSON.stringify(mode),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
    },
  };
});
