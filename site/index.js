// serve http

const fs = require("fs");
const utils = require("./utils");
const www = require("./www");

const port = process.env.PORT || 8000;

const server = www.makeServer();

const pages = {
	"/": () => require("./doc"),
	"/guide": () => require("./guide"),
	"/examples": () => require("./examples"),
	"/example/:name": (req, res) => {
		const name = req.params.name;
		const path = `../examples/${name}.js`;
		if (fs.existsSync(path)) {
			return require("./example")(name);
		}
	},
	"/type/:name": (req, res) => {
		return require("./type")(req.params.name);
	},
};

for (const path in pages) {
	server.match(path, (req, res) => {
		const result = pages[path](req, res);
		if (result) {
			res.html(result);
		}
	});
}

const versions = utils.versions();

server.fs("/pub", "pub");
server.fs("/pub/examples", "../examples");
server.fs("/sprites", "../sprites");
server.fs("/sounds", "../sounds");
server.fs("/lib", "lib");
server.fs("/lib/latest", `lib/${versions.latest}`);
server.fs("/lib/dev", "../dist");
// TODO: deprecate
server.fs("/lib/master", "lib/0.0.0");
server.fs("/assets", "assets");

server.match("/changelog", (req, res) => {
	res.file("../CHANGELOG.md");
});

server.match("/readme", (req, res) => {
	res.file("../README.md");
});

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
