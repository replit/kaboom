const http = require("http");
const dofile = require("./dofile");

const server = http.createServer((req, res) => {
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.writeHead(200);
	res.end(dofile("./page"));
});

server.listen(8080);

