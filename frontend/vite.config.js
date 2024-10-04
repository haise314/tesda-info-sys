import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend server
        changeOrigin: true,
        secure: false, // Set this to false if you’re not using HTTPS on localhost
        // rewrite: path => path.replace(/^\/api/, ''),  // Uncomment if needed
      },
    },
  },
});
