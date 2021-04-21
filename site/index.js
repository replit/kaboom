// serve http

const fs = require("fs");
const utils = require("./utils");

const {
	makeServer,
} = require("./www");

const port = process.env.PORT || 8000;

const server = makeServer();

const pages = {
	"/": () => require("./doc"),
	"/guide": () => require("./guide"),
	"/examples": () => require("./examples"),
	"/example/:name": (req, res) => require("./example")(req.params.name),
};

for (const path in pages) {
	server.match(path, (req, res) => {
		res.html(pages[path](req, res));
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
	res.cors();
	res.json([ "latest", ...versions, "dev", ]);
});

server.match("/latest", (req, res) => {
	res.cors();
	res.json(latestVer);
});

server.handle((req, res) => {
	res.status(404);
	res.text("nope");
});

console.log(`http://localhost:${port}`);

server.serve(port);
