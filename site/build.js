const esbuild = require("esbuild");
const fs = require("fs");

esbuild.buildSync({
	bundle: true,
	sourcemap: true,
	target: "es6",
	minify: true,
	keepNames: true,
	entryPoints: [ "pages/index.tsx", ],
	outdir: "public/pages",
});
