// serve http

const fs = require("fs");
const http = require("http");
const dofile = require("./dofile");

const {
	serveFs,
} = require("./www");

const port = process.env.PORT || 8000;

const pages = {
	"/": () => {
		return dofile("./main");
	},
	"/guide": () => {
		return dofile("./guide");
	},
	"/examples": () => {
		return dofile("./examples");
	},
};

const server = http.createServer((req, res) => {

	try {

		for (const target in pages) {
			if (req.url === target) {
				const content = pages[target]();
				res.setHeader("Content-Type", "text/html; charset=utf-8");
				res.writeHead(200);
				res.end(content);
				return;
			}
		}

		serveFs("/pub", "pub")(req, res);
		serveFs("/lib", "lib")(req, res);

		if (req.url === "/libdata") {

			const versions = fs
				.readdirSync("lib")
				.filter(p => !p.startsWith("."))
				;

			res.setHeader("Content-Type", "application/json");
			res.writeHead(200);
			res.end(JSON.stringify({
				versions: versions,
			}));

			return;

		}

		if (res.finished) {
			return;
		}

		res.setHeader("Content-Type", "text/plain");
		res.writeHead(404);
		res.end("nope");

	} catch (e) {

		console.error(e);
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.writeHead(500);
		res.end(`<pre>${e.stack}</pre>`);

	}

});

for (const target in pages) {
	console.log(`http://localhost:${port}${target}`);
}

server.listen(port);

