// kaboom run server

const fs = require("fs");
const path = require("path");
const http = require("http");
const port = process.env.PORT || 8000;
const server = http.createServer();

const mimes = {
	".js": "text/javascript",
	".json": "application/json",
	".png": "image/png",
	".kbmsprite": "application/json",
	".ogg": "audio/ogg",
};

function buildHTML() {

	let importCode = '';
	let gameCode = '';

	const conf = JSON.parse(fs.readFileSync("conf.json"));
	const scenesDir = fs.readdirSync("scenes");
	const spritesDir = fs.readdirSync("sprites");
	const soundsDir = fs.readdirSync("sounds");

	for (const file of spritesDir) {
		const name = path.basename(file, path.extname(file));
		gameCode += `loadSprite("${name}", "sprites/${file}");\n`;
	}

	for (const file of soundsDir) {
		const name = path.basename(file, path.extname(file));
		gameCode += `loadSound("${name}", "sounds/${file}");\n`;
	}

	gameCode += `
init({
	width: ${conf.fullscreen} ? window.innerWidth / ${conf.scale} : ${conf.width},
	height: ${conf.fullscreen} ? window.innerHeight / ${conf.scale} : ${conf.height},
	scale: ${conf.scale},
});
	`;

	for (const file of scenesDir) {
		const name = path.basename(file, path.extname(file));
		const content = fs.readFileSync(`scenes/${file}`);
		gameCode += `scene("${name}", (args = {}) => {\n${content}\n});\n`;
	}

	gameCode += `start("${conf.startScene}");\n`;

	const libFiles = [
		"kaboom.js",
		"kit/physics.js",
		"kit/starter.js",
		"kit/level.js",
	];

	conf.version = "master";

	for (const file of libFiles) {
		importCode += `<script src="https://kaboom.slmjkdbtl.repl.co/lib/${conf.version}/${file}"></script>\n`;
	}

	return `
<!DOCTYPE html>

<html>

<head>
	<title>kaboom</title>
	<meta charset="utf-8">
	<style>
		* {
			margin: 0;
		}
		html,
		body {
			width: 100%;
			height: 100%;
			overflow: hidden;
		}
		canvas {
			display: block;
		}
	</style>
</head>

<body>
${importCode}
	<script>kaboom.import();</script>
	<script>
${gameCode}
	</script>
</body>

</html>
	`;

}

server.on("request", async (req, res) => {

	if (req.url === "/") {

		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.writeHead(200);

		try {
			res.end(buildHTML());
		} catch (e) {
			res.end(`<pre>${e.stack}</pre>`);
		}

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

