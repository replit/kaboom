// serve http

const http = require("http");
const dofile = require("./dofile");
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.writeHead(200);
	res.end(dofile("./page"));
});

console.log(`http://localhost:${port}`);
server.listen(port);

