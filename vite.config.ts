/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { configDefaults } from 'vitest/dist/config.js'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: 'tsconfig.app.json'
    })
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: 'src/components/main.ts',
      name: 'BelvoPaymentsAtoms',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'belvo-payments-atoms'
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/components/main.ts')
      },
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    clearMocks: true,
    coverage: {
      provider: 'v8',
      all: true,
      thresholds: {
        global: {
          statements: 1,
          branches: 1,
          functions: 1,
          lines: 1
        }
      },
      exclude: [
        ...configDefaults.exclude,
        '*.cjs',
        '*.d.ts',
        '**/*.stories.*',
        '.storybook/**',
        'src/types/**',
        'src/components/index.ts',
        'examples/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
