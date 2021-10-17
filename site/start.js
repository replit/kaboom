const esbuild = require("esbuild");

esbuild.build({
	bundle: true,
	sourcemap: true,
	target: "es6",
	minify: true,
	keepNames: true,
	jsxFactory: "jsx",
	watch: process.env.NODE_ENV === "development",
	inject: [ "inject.js", ],
	entryPoints: [ "pages/home_hydrate.tsx", "pages/play_hydrate.tsx" ],
	outdir: "public/pages",
});

let server = null;

function postBuild() {
	if (server) server.close();
	server = dofile("./site").default;
}

function dofile(mod) {
	delete require.cache[require.resolve(mod)];
	return require(mod);
}

esbuild.build({
	bundle: true,
	sourcemap: true,
	target: "es6",
	minify: true,
	keepNames: true,
	jsxFactory: "jsx",
	platform: "node",
	watch: process.env.NODE_ENV === "development" ? {
		onRebuild: postBuild,
	} : false,
	inject: [ "inject.js", ],
	entryPoints: [ "run.tsx" ],
	outfile: "site.js",
}).then(postBuild);
