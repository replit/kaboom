const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

esbuild.build({
	bundle: true,
	sourcemap: true,
	target: "es6",
	minify: true,
	keepNames: true,
	jsxFactory: "jsx",
	watch: process.env.NODE_ENV === "development",
	inject: [ "inject.js", ],
	entryPoints: [ "pages/index.tsx", "pages/play.tsx" ],
	outdir: "public/pages",
});

const static = (route, p) => app.use(route, express.static(path.resolve(__dirname, p)));

const page = (route, name) => {
	app.get(route, (req, res) => {
		res.send(`
<!DOCTYPE html>
<html>
<head>
</head>
<body>
	<script src="/site/pages/${name}.js"></script>
</body>
</html>
		`);
	});
}

page("/", "index");
page("/play", "play");
static("/sprites", "../assets/sprites");
static("/sounds", "../assets/sounds");
static("/fonts", "../assets/fonts");
static("/site", "public");
static("/site/demo", "../demo");
static("/lib", "../dist");

app.listen(port, () => console.log(`site running at http://localhost:${port}`));
