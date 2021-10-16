const esbuild = require("esbuild");
const fs = require("fs");

esbuild.buildSync({
	bundle: true,
	sourcemap: true,
	target: "es6",
	minify: true,
	keepNames: true,
	jsxFactory: "jsx",
	inject: [ "inject.js", ],
	entryPoints: [ "pages/index.tsx", "pages/play.tsx" ],
	outdir: "public/pages",
});
