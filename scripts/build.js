const esbuild = require("esbuild");

console.log("dist/kaboom.min.js");

esbuild.buildSync({
	entryPoints: ["src/kaboom.js"],
	bundle: true,
	minify: true,
	sourcemap: true,
	outfile: "dist/kaboom.min.js",
});
