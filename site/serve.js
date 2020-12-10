// serve http

const http = require("http");
const dofile = require("./dofile");
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
	if (req.url === "/") {
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.writeHead(200);
		res.end(dofile("./main"));
	} else if (req.url === "/guide") {
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.writeHead(200);
		res.end(dofile("./guide"));
	}
});

console.log(`http://localhost:${port}`);
server.listen(port);

