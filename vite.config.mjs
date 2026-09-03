import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_BE_URL || "http://localhost:3016";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
        "@shared": path.resolve(import.meta.dirname, "./shared"),
      },
    },
    server: {
      proxy: {
        "/api": { target: backendUrl, changeOrigin: true },
        "^/(image|cover_front|cover_back)-": {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/test-setup.ts"],
      include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
        "@shared": path.resolve(import.meta.dirname, "./shared"),
      },
    },
  };
});
