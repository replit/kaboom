// serve http

const fs = require("fs");
const path = require("path");
const http = require("http");
const port = process.env.PORT || 8000;

function readdir(path) {
	return fs
		.readdirSync(path)
		.filter(p => p !== ".DS_Store")
		.map(p => path + "/" + p)
		;
}

const files = [
	"kaboom.js",
	...readdir("kit"),
	...readdir("demo"),
];

const mimes = {
	".mp3": "audio/mpeg",
	".ogg": "audio/ogg",
	".wav": "audio/wav",
	".png": "image/png",
	".jpg": "image/jpeg",
	".css": "text/css",
	".html": "text/html; charset=utf-8",
	".js": "text/javascript",
	".json": "application/json",
};

const server = http.createServer((req, res) => {

	for (const file of files) {
		if (req.url === "/" + file) {
			const mime = mimes[path.extname(file)];
			if (mime) {
				res.setHeader("Content-Type", mime);
			}
			res.statusCode = 200;
			res.end(fs.readFileSync(file));
			return;
		}
	}

	res.statusCode = 404;
	res.end();

});

console.log(`http://localhost:${port}/demo/index.html`);

server.listen(port);

