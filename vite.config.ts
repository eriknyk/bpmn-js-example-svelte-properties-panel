import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import rawPlugin from "vite-raw-plugin";

export default defineConfig({
  plugins: [sveltekit(), rawPlugin({ fileRegex: /\.bpmn$/ })],
  ssr: {
    noExternal: ["bpmn-js", "diagram-js"],
  },
});
