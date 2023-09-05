import fs from "fs/promises"
import path from "path"
import http from "http"
import * as esbuild from "esbuild"

const examples = (await fs.readdir("examples"))
	.filter((p) => !p.startsWith(".") && p.endsWith(".ts"))
	.map((d) => path.basename(d, ".ts"))

const page = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
* {
	margin: 0;
	padding: 0;
}
body {
	padding: 16px;
	font-size: 16px;
	font-family: Monospace;
}
li {
	list-style: none;
}
a {
	color: blue;
	text-decoration: none;
}
a:hover {
	background: blue;
	color: white;
}
</style>
</head>
<body>
${examples.map((example) => `<li><a href="/example/${example}">${example}</a></li>`).join("")}
</body>
</html>
`

await fs.writeFile("examples/www/index.html", page)

const ctx = await esbuild.context({
	entryPoints: examples.map((e) => `examples/${e}.ts`),
	// outfile: "example/bundle.js",
	outdir: "examples/www",
	bundle: true,
	minify: true,
	sourcemap: true,
	keepNames: true,
	loader: {
		".png": "dataurl",
		".mp3": "binary",
		".woff2": "binary",
	},
	alias: {
		"kaboom": "./src/kaboom",
	},
})

await ctx.watch()

const { host, port } = await ctx.serve({
	servedir: "examples/www",
})

// Then start a proxy server on port 3000
http.createServer((req, res) => {
	const opts = {
		hostname: host,
		port: port,
		path: req.url,
		method: req.method,
		headers: req.headers,
	}

	// Forward each incoming request to esbuild
	const proxyReq = http.request(opts, (proxyRes) => {
		if (req.url.startsWith("/example/")) {
			const example = req.url.replace(/^\/example\//, "")
			res.writeHead(200, { "Content-Type": "text/html" })
			res.end(`
<!DOCTYPE html>
<html>
<head>
</head>
<body>
<script src="/${example}.js"></script>
</body>
</html>
			`)
			return
		}
		res.writeHead(proxyRes.statusCode, proxyRes.headers)
		proxyRes.pipe(res, { end: true })
	})

	// Forward the body of the request to esbuild
	req.pipe(proxyReq, { end: true })
}).listen(3001)

console.log("http://localhost:3001")
