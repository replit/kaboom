const esbuild = require("esbuild");
const devDir = "src";

esbuild.buildSync({
	entryPoints: ["src/kaboom.js"],
	bundle: true,
	sourcemap: true,
	format: "iife",
	watch: {
		onRebuild(err, res) {
			if (err) {
				console.error(err);
			} else {
				console.log(res);
			}
		},
	},
	outfile: "dist/kaboom.js",
});

