import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
import dns from "dns"

dns.setDefaultResultOrder("verbatim")
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: "localhost",
    port: 3002
  },
  resolve: {
    alias: {
      "@api": "/src/api",
      "@utils": "/src/utils",
      "@custom-components": "/src/custom-components",
      "@hooks": "/src/hooks",
      "@assets": "/src/assets",
      "@views": "/src/views",
      "@scss": "/src/scss",
      "@src": "/src"
    }
  }
})
