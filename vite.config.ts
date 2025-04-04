import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [react(), tailwindcss(), wasm()],
  base: "/",
  server: {
    fs: {
      allow: ["."]
    }
  }
});
