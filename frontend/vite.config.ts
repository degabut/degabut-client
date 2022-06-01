import path from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import svgString from "./plugins/svgString";

export default defineConfig({
	plugins: [solidPlugin(), svgString()],
	build: {
		target: "esnext",
		polyfillDynamicImport: false,
	},
	server: {
		host: true,
	},
	resolve: {
		alias: {
			"@api": path.resolve("./src/api"),
			"@directives": path.resolve("./src/directives"),
			"@hooks": path.resolve("./src/hooks"),
			"@providers": path.resolve("./src/providers"),
			"@components": path.resolve("./src/components"),
			"@stores": path.resolve("./src/stores"),
			"@views": path.resolve("./src/views"),
			"@utils": path.resolve("./src/utils"),
			"@runtime": path.resolve("./wailsjs/runtime/runtime"),
		},
	},
});
