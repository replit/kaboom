// serve http

const fs = require("fs");
const utils = require("./utils");

const {
	makeServer,
} = require("./www");

const port = process.env.PORT || 8000;

const server = makeServer();

const pages = {
	"/": require("./doc"),
	"/guide": require("./guide"),
	"/examples": require("./examples"),
};

for (const path in pages) {
	server.match(path, (req, res) => {
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.writeHead(200);
		res.end(pages[path]);
	});
}

const versions = fs
	.readdirSync("lib")
	.filter(p => !p.startsWith("."))
	;

const latestVer = versions.reduce(utils.cmpSemVer);

server.fs("/pub", "pub");
server.fs("/lib", "lib");
server.fs("/lib/latest", `lib/${latestVer}`);
server.fs("/lib/dev", "../src");
// TODO: deprecate
server.fs("/lib/master", "lib/0.0.0");

server.match("/versions", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.writeHead(200);
	res.end(JSON.stringify([ "latest", ...versions, "dev", ]));
});

server.match("/latest", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.writeHead(200);
	res.end(JSON.stringify(latestVer));
});

server.handle((req, res) => {
	res.setHeader("Content-Type", "text/plain");
	res.writeHead(404);
	res.end("nope");
});

for (const target in pages) {
	console.log(`http://localhost:${port}${target}`);
}

server.serve(port);
