import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// We wrap the entire export in an async function to allow for dynamic imports.
export default defineConfig(async () => {
  // We use a dynamic import() which correctly loads modern ESM packages.
  const { componentTagger } = await import("lovable-tagger");

  // We return the final configuration object from inside the function.
  return {
    plugins: [
      react(),
      // Now the plugin can be used without causing an error.
      componentTagger(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
