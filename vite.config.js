import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: false, // Prevents Vite from opening the browser
  },
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(import.meta.dirname, 'lib/main.ts'),
      name: 'LabanJS',
      // the proper extensions will be added
      fileName: 'labanjs',
    },
    rolldownOptions: {
      output: {
      },
    },
  },
})
