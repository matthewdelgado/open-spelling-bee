import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { vueI18n } from "@intlify/vite-plugin-vue-i18n";
import checker from "vite-plugin-checker";

const dateHash = new Date().toISOString().split("T")[0];

export default defineConfig({
  plugins: [
    checker({ typescript: true }),
    vue(),
    vueI18n({
      include: path.resolve(__dirname, "./src/locales/**"),
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name]-${dateHash}.js`,
        chunkFileNames: `[name]-${dateHash}.js`,
        assetFileNames: `[name]-${dateHash}.[ext]`,
      },
    },
  },
});
