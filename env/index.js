// start kaboom server

const fs = require("fs");
const path = require("path");
const http = require("http");
const port = process.env.PORT || 8000;

const mimes = {
	".js": "text/javascript",
	".json": "application/json",
	".png": "image/png",
	".pix": "application/json",
	".ogg": "audio/ogg",
};

const template = `
<!DOCTYPE html>

<html>

<head>
	<title>kaboom</title>
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

const server = http.createServer();

server.on("request", async (req, res) => {

	if (req.url === "/") {

		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.writeHead(200);

		const codeDir = fs.readdirSync("code");
		const spritesDir = fs.readdirSync("sprites");
		const soundsDir = fs.readdirSync("sounds");
		let includeStr = "";

		// load assets
		includeStr += "<script>\n";
		for (const file of spritesDir) {
			const name = path.basename(file, path.extname(file));
			includeStr += `loadSprite("${name}", "sprites/${file}");\n`;
		}
		for (const file of soundsDir) {
			const name = path.basename(file, path.extname(file));
			includeStr += `loadSound("${name}", "sounds/${file}");\n`;
		}
		includeStr += "</script>\n";

		// include code
		for (const file of codeDir) {
			if (path.extname(file) === ".js" && `${__dirname}/${file}` !== __filename) {
				includeStr += `<script src=code/${file}></script>\n`;
			}
		}

		const html = template.replace("{{include}}", includeStr);

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

