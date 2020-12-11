// serve http

const http = require("http");
const dofile = require("./dofile");
const port = process.env.PORT || 8000;

function html(res, txt) {
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.writeHead(200);
	res.end(txt);
}

function serve(req, res) {
	if (req.url === "/") {
		html(res, dofile("./main"));
	} else if (req.url === "/guide") {
		html(res, dofile("./guide"));
	}
}

const server = http.createServer((req, res) => {
	try {
		serve(req, res);
	} catch (e) {
		console.log(e);
		res.writeHead(500);
		res.end(e.stack);
	}
});

console.log(`http://localhost:${port}`);
server.listen(port);

