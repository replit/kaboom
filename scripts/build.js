const path = require("path");
const esbuild = require("esbuild");

const common = {
	bundle: true,
	sourcemap: true,
	target: "es6",
	loader: {
		".png": "dataurl",
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

function build(src, dist, cfg) {
	console.log(`${src} -> ${dist}`);
	esbuild.buildSync({
		...cfg,
		entryPoints: [ src, ],
		outfile: dist,
	});
}

files.forEach((file) => {
	fmts.forEach((fmt) => {
		const base = file.entry.replace(/\.ts$/, "");
		const cfg = {
			...common,
			entryPoints: [  ],
			globalName: file.global,
			format: fmt.format,
		};
		build(
			`${srcDir}/${file.entry}`,
			`${distDir}/${base}.${fmt.ext}`,
			cfg,
		);
		build(
			`${srcDir}/${file.entry}`,
			`${distDir}/${base}.min.${fmt.ext}`,
			{
				...cfg,
				minify: true,
			},
		);
	});
});
