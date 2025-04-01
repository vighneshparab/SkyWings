import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/users": {
        target: "https://sky-wings-server.vercel.app", // Backend server URL
        changeOrigin: true, // Ensure the origin header is correctly set
        secure: true, // If your backend uses HTTPS
        rewrite: (path) => path.replace(/^\/users/, ''), // Optional: Rewrite path if needed
      },
      "/uploads": {
        target: "https://sky-wings-server.vercel.app", // If you still need to proxy uploads
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
