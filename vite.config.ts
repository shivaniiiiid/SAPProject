import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5000,
    strictPort: true,
    allowedHosts: [
      '.replit.dev',
      '.pike.replit.dev',
    ],
    hmr: process.env.REPLIT_DEV_DOMAIN ? {
      protocol: 'wss',
      clientPort: 443,
      host: process.env.REPLIT_DEV_DOMAIN,
    } : undefined,
    watch: {
      ignored: ['**/.cache/**', '**/node_modules/**'],
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
