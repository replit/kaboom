const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const common = {
	bundle: true,
	sourcemap: true,
	target: "es6",
	minify: true,
	keepNames: true,
	loader: {
		".png": "dataurl",
		".mp3": "dataurl",
		".glsl": "text",
	},
};

const fmts = [
	{ format: "iife", ext: "js",  },
	{ format: "cjs",  ext: "cjs", },
	{ format: "esm",  ext: "mjs", },
];

const srcDir = "src";
const distDir = "dist";

const files = [
	{ entry: "kaboom.ts",           global: "kaboom",         },
	{ entry: "plugins/aseprite.ts", global: "asepritePlugin", },
	{ entry: "plugins/pedit.ts",    global: "peditPlugin",    },
	{ entry: "plugins/04b03.ts",    global: "b04b03Plugin",    },
	{ entry: "plugins/cp437.ts",    global: "cp437Plugin",    },
	{ entry: "plugins/proggy.ts",   global: "proggyPlugin",   },
];

files.forEach((file) => {
	fmts.forEach((fmt) => {
		const base = file.entry.replace(/\.ts$/, "");
		const srcPath = `${srcDir}/${file.entry}`;
		const distPath = `${distDir}/${base}.${fmt.ext}`;
		console.log(`${srcPath} -> ${distPath}`);
		esbuild.buildSync({
			...common,
			entryPoints: [srcPath],
			globalName: file.global,
			format: fmt.format,
			outfile: distPath,
		});
	});
});

// TODO: haven't figured out how to generate the desired .d.ts with tsc
const types = fs.readFileSync(`${srcDir}/types.ts`, "utf-8")
	.replace(/type/g, "export type")
	.replace(/declare/g, "export default");
fs.writeFileSync(`${distDir}/kaboom.d.ts`, types);
