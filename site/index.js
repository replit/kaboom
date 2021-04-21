// serve http

const fs = require("fs");
const utils = require("./utils");
const www = require("./ext/www");

const port = process.env.PORT || 8000;

const server = www.makeServer();

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

const versions = utils.versions();

server.fs("/pub", "pub");
server.fs("/pub/examples", "../examples");
server.fs("/lib", "lib");
server.fs("/lib/latest", `lib/${versions.latest}`);
server.fs("/lib/dev", "../src");
// TODO: deprecate
server.fs("/lib/master", "lib/0.0.0");

server.match("/versions", (req, res) => {
	res.cors();
	res.json([ "latest", ...versions.list, "dev", ]);
});

server.match("/latest", (req, res) => {
	res.cors();
	res.json(versions.latest);
});

server.handle((req, res) => {
	res.status(404);
	res.text("nope");
});

server.errhand((req, res, e) => {
	console.error(e);
	res.status(500);
	res.html(`<pre>${e.stack}</pre>`);
});

console.log(`http://localhost:${port}`);
console.log(`http://localhost:${port}/examples`);

server.serve(port);
