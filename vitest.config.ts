import { fileURLToPath, URL } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
// import viteConfig from './vite.config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      setupFiles: ['./tests/vitest.setup.ts'], // 👈 これを追加
      globals: true,
      environment: 'jsdom',
      deps: {
        inline: ['vuetify'],
      },   
      exclude: [...configDefaults.exclude, 'e2e/**'],
      // root: fileURLToPath(new URL('./', import.meta.url)),
    },
  })
