import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ template: "treemap", gzipSize: true }),
    viteStaticCopy({
      targets: [
        {
          src: "./node_modules/@voxeet/voxeet-web-sdk/dist/dvdnr.wasm",
          dest: "assets/wasm",
        },
        {
          src: "./node_modules/@voxeet/voxeet-web-sdk/dist/lensnet_echo_0_7.bin",
          dest: "assets/wasm",
        },
        {
          src: "./node_modules/@voxeet/voxeet-web-sdk/dist/vsl_impl.bin",
          dest: "assets/wasm",
        },
        {
          src: "./node_modules/@voxeet/voxeet-web-sdk/dist/vsl_impl.wasm",
          dest: "assets/wasm",
        },
        {
          src: "./node_modules/@voxeet/voxeet-web-sdk/dist/dvwc_impl.wasm",
          dest: "assets/wasm",
        },
        {
          src: "./node_modules/@voxeet/voxeet-web-sdk/dist/voxeet-dvwc-worker.js",
          dest: "assets/wasm",
        },
        {
          src: "./node_modules/@voxeet/voxeet-web-sdk/dist/voxeet-worklet.js",
          dest: "assets/wasm",
        },
      ],
    }),
  ],

  test: {
    environment: "jsdom",
    reporters: ["default", "junit"],
    outputFile: "./junit.xml",
  },
});
