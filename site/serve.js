// serve http

const http = require("http");
const dofile = require("./dofile");
const port = process.env.PORT || 8000;

const pages = {
	"/": () => {
		return dofile("./main");
	},
	"/guide": () => {
		return dofile("./guide");
	},
};

const server = http.createServer((req, res) => {

	try {

		for (const target in pages) {
			if (req.url === target) {
				res.setHeader("Content-Type", "text/html; charset=utf-8");
				res.writeHead(200);
				res.end(pages[target]());
			}
		}

		if (!res.finished) {
			res.writeHead(404);
			res.end("no");
		}

	} catch (e) {

		console.error(e);
		res.writeHead(500);
		res.end(e.stack);

	}

});

for (const target in pages) {
	console.log(`http://localhost:${port}${target}`);
}

server.listen(port);

