// vite.config.ts
import vue from "file:///Users/evandroguedes/Documents/work/repos/payments-atoms/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import * as path from "path";
import { defineConfig } from "file:///Users/evandroguedes/Documents/work/repos/payments-atoms/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/evandroguedes/Documents/work/repos/payments-atoms/node_modules/vite-plugin-dts/dist/index.mjs";
import { configDefaults } from "file:///Users/evandroguedes/Documents/work/repos/payments-atoms/node_modules/vitest/dist/config.js";
var __vite_injected_original_dirname = "/Users/evandroguedes/Documents/work/repos/payments-atoms";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "tsconfig.app.json"
    })
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: "src/components/main.ts",
      name: "BelvoPaymentsAtoms",
      formats: ["es", "cjs", "umd"],
      fileName: "belvo-payments-atoms"
    },
    rollupOptions: {
      input: {
        main: path.resolve(__vite_injected_original_dirname, "src/components/main.ts")
      },
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue"
        }
      }
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    clearMocks: true,
    coverage: {
      provider: "v8",
      all: true,
      thresholds: {
        100: true
      },
      exclude: [
        ...configDefaults.exclude,
        "*.cjs",
        "*.d.ts",
        "**/*.stories.*",
        ".storybook/**",
        "src/types/**",
        "src/components/index.ts",
        "examples/**"
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZXZhbmRyb2d1ZWRlcy9Eb2N1bWVudHMvd29yay9yZXBvcy9wYXltZW50cy1hdG9tc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2V2YW5kcm9ndWVkZXMvRG9jdW1lbnRzL3dvcmsvcmVwb3MvcGF5bWVudHMtYXRvbXMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2V2YW5kcm9ndWVkZXMvRG9jdW1lbnRzL3dvcmsvcmVwb3MvcGF5bWVudHMtYXRvbXMvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCB7IGNvbmZpZ0RlZmF1bHRzIH0gZnJvbSAndml0ZXN0L2Rpc3QvY29uZmlnLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgZHRzKHtcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXG4gICAgICB0c2NvbmZpZ1BhdGg6ICd0c2NvbmZpZy5hcHAuanNvbidcbiAgICB9KVxuICBdLFxuICBidWlsZDoge1xuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiAnc3JjL2NvbXBvbmVudHMvbWFpbi50cycsXG4gICAgICBuYW1lOiAnQmVsdm9QYXltZW50c0F0b21zJyxcbiAgICAgIGZvcm1hdHM6IFsnZXMnLCAnY2pzJywgJ3VtZCddLFxuICAgICAgZmlsZU5hbWU6ICdiZWx2by1wYXltZW50cy1hdG9tcydcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29tcG9uZW50cy9tYWluLnRzJylcbiAgICAgIH0sXG4gICAgICBleHRlcm5hbDogWyd2dWUnXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBleHBvcnRzOiAnbmFtZWQnLFxuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgdnVlOiAnVnVlJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBjbGVhck1vY2tzOiB0cnVlLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICBwcm92aWRlcjogJ3Y4JyxcbiAgICAgIGFsbDogdHJ1ZSxcbiAgICAgIHRocmVzaG9sZHM6IHtcbiAgICAgICAgMTAwOiB0cnVlXG4gICAgICB9LFxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAuLi5jb25maWdEZWZhdWx0cy5leGNsdWRlLFxuICAgICAgICAnKi5janMnLFxuICAgICAgICAnKi5kLnRzJyxcbiAgICAgICAgJyoqLyouc3Rvcmllcy4qJyxcbiAgICAgICAgJy5zdG9yeWJvb2svKionLFxuICAgICAgICAnc3JjL3R5cGVzLyoqJyxcbiAgICAgICAgJ3NyYy9jb21wb25lbnRzL2luZGV4LnRzJyxcbiAgICAgICAgJ2V4YW1wbGVzLyoqJ1xuICAgICAgXVxuICAgIH1cbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxPQUFPLFNBQVM7QUFDaEIsWUFBWSxVQUFVO0FBQ3RCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixTQUFTLHNCQUFzQjtBQUwvQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsTUFDRixrQkFBa0I7QUFBQSxNQUNsQixjQUFjO0FBQUEsSUFDaEIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGNBQWM7QUFBQSxJQUNkLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxNQUFNLE9BQU8sS0FBSztBQUFBLE1BQzVCLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFXLGFBQVEsa0NBQVcsd0JBQXdCO0FBQUEsTUFDeEQ7QUFBQSxNQUNBLFVBQVUsQ0FBQyxLQUFLO0FBQUEsTUFDaEIsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQ1QsU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQSxJQUNaLFVBQVU7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLEtBQUs7QUFBQSxNQUNMLFlBQVk7QUFBQSxRQUNWLEtBQUs7QUFBQSxNQUNQO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxHQUFHLGVBQWU7QUFBQSxRQUNsQjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBVSxhQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
