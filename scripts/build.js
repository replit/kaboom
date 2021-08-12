const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const fmts = [
	{ format: "iife", ext: "js",  },
	{ format: "cjs",  ext: "cjs", },
	{ format: "esm",  ext: "mjs", },
];

const srcDir = "src";
const distDir = "dist";

fmts.forEach((fmt) => {

	const srcPath = `${srcDir}/kaboom.ts`;
	const distPath = `${distDir}/kaboom.${fmt.ext}`;

	console.log(`${srcPath} -> ${distPath}`);

	esbuild.buildSync({
		bundle: true,
		sourcemap: true,
		target: "es6",
		minify: true,
		keepNames: true,
		loader: {
			".png": "dataurl",
			".glsl": "text",
			".mp3": "binary",
		},
		entryPoints: [ srcPath ],
		globalName: "kaboom",
		format: fmt.format,
		outfile: distPath,
	});

});

// TODO: haven't figured out how to generate the desired .d.ts with tsc
const types = fs.readFileSync(`${srcDir}/types.ts`, "utf-8")
	.replace(/type/g, "export type")
	.replace(/declare/g, "export default");
fs.writeFileSync(`${distDir}/kaboom.d.ts`, types);
