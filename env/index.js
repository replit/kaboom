// start kaboom server

const fs = require("fs");
const path = require("path");
const http = require("http");
const port = process.env.PORT || 8000;

const mimes = {
	".js": "text/javascript",
	".png": "image/png",
	".ogg": "audio/ogg",
};

const template = `
<!DOCTYPE html>

<html>

<head>
	<title>game</title>
	<meta charset="utf-8">
	<style>
		* {
			margin: 0;
		}
		canvas {
			display: block;
		}
		</style>
	</head>

<body>
	<script src="https://kaboomjs.repl.co/kaboom.js"></script>
	<script src="https://kaboomjs.repl.co/kit/physics.js"></script>
	<script src="https://kaboomjs.repl.co/kit/map.js"></script>
	<script src="https://kaboomjs.repl.co/kit/starter.js"></script>
	<script>kaboom.import();</script>
{{include}}
	</body>

</html>

`;

const server = http.createServer((req, res) => {

	if (req.url === "/") {

		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.writeHead(200);

		const dir = fs.readdirSync(".");
		const includeStr = [];

		for (let file of dir) {
			if (path.extname(file) === ".js" && file !== "index.js") {
				includeStr.push(`<script src=${file}></script>`);
			}
		}

		const html = template.replace("{{include}}", includeStr.join("\n"));

		res.end(html);

		return;

	}

	const fpath = "." + req.url;

	if (!fs.existsSync(fpath)) {
		res.writeHead(404);
		res.end();
		return;
	}

	const extname = path.extname(fpath);
	const mime = mimes[extname];

	if (mime) {
		res.setHeader("Content-Type", mime);
	}

	res.end(fs.readFileSync(fpath));

});

server.listen(port);

