// kaboom dev server

const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const express = require("express");
const chokidar = require("chokidar");
const ws = require("ws");
const http = require("http");
const Database = require("@replit/database");
const db = new Database();
const app = express();
const server = http.createServer(app);
const wsServer = new ws.Server({ server: server, path: "/devws" });
const port = process.env.PORT || 8000;
let conf = JSON.parse(fs.readFileSync("conf.json", "utf-8"));
let err = null;

// build user game
function buildGame() {

	conf = JSON.parse(fs.readFileSync("conf.json", "utf-8"));

	const template = fs.readFileSync("template.html", "utf-8");
	let code = "";

	code += `<script src="/dist/helper.js"></script>\n`;

	try {

		// build user code
		esbuild.buildSync({
			bundle: true,
			sourcemap: true,
			target: "es6",
			minify: true,
			keepNames: true,
			logLevel: "silent",
			entryPoints: ["code/main.js"],
			outfile: "dist/game.js",
		});

		esbuild.buildSync({
			bundle: true,
			sourcemap: true,
			target: "es6",
			minify: true,
			keepNames: true,
			entryPoints: ["helper.js"],
			outfile: "dist/helper.js",
		});

	} catch (e) {
		const loc = e.errors[0].location;
		err = {
			msg: e.errors[0].text,
			stack: [
				{
					line: loc.line,
					col: loc.column,
					file: loc.file,
				},
			],
		};
	}

	code += `<script src="/dist/game.js"></script>\n`;

	fs.writeFileSync("dist/index.html", template.replace("{{kaboom}}", code));

}

// server stuff
app.use(express.json({ strict: false }));

app.get("/", (req, res) => {
	reset();
	buildGame();
	res.sendFile(__dirname + "/dist/index.html");
	render();
});

app.post("/error", (req, res) => {
	err = req.body;
	render();
});

app.get("/user", (req, res) => {
	if (req.headers["x-replit-user-id"]) {
		res.json({
			id: req.headers["x-replit-user-id"] || null,
			name: req.headers["x-replit-user-name"] || null,
		});
	} else {
		res.json(null);
	}
});

// TODO: authed user level abstraction?
app.get("/db", async (req, res) => {
	try {
		res.json(await db.list());
	} catch (e) {
		res.sendStatus(500);
	}
});

app.get("/db/:item", async (req, res) => {
	try {
		res.json(await db.get(req.params.item));
	} catch (e) {
		res.sendStatus(500);
	}
});

app.post("/db/:item", async (req, res) => {
	try {
		db.set(req.params.item, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.sendStatus(500);
	}
});

app.use("/sprites", express.static("sprites"));
app.use("/sounds", express.static("sounds"));
app.use("/code", express.static("code"));
app.use("/dist", express.static("dist"));

if (conf.liveReload) {
	chokidar.watch([
		"code",
		"sprites",
		"sounds",
		"template.html",
		"conf.json",
	]).on("all", () => {
		if (!conf.liveReload) {
			return;
		}
		wsServer.clients.forEach((client) => {
			if (client.readyState === ws.OPEN) {
				client.send(JSON.stringify("REFRESH"));
			}
		});
	});
}

server.listen(port);

// term output
let numO = 2;
let curO = null;
let anim = null;
let anim2 = null;
const MAX_O = 32;
const INC_SPEED = 16000;
const ROLL_SPEED_MIN = 200;
const ROLL_SPEED_MAX = 50;

function reset() {
	clearTimeout(anim);
	clearTimeout(anim2);
	curO = null;
	err = null;
	anim = setTimeout(next, INC_SPEED);
	process.stdout.write("\x1b[2J");
}

function next() {
	curO = 0;
	render();
	anim2 = setTimeout(roll, ROLL_SPEED_MIN);
}

function roll() {
	curO += 1;
	if (curO >= numO) {
		if (numO < MAX_O) {
			numO += 1;
		}
		curO = null;
		clearInterval(anim2);
		anim = setTimeout(next, INC_SPEED);
	} else {
		anim2 = setTimeout(roll, map(curO, 0, numO, ROLL_SPEED_MIN, ROLL_SPEED_MAX));
	}
	render();
}

const map = (v, a1, b1, a2, b2) => a2 + (v - a1) / (b1 - a1) * (b2 - a2);
const red = (msg) => `\x1b[31m${msg}\x1b[0m`;
const yellow = (msg) => `\x1b[33m${msg}\x1b[0m`;
const dim = (msg) => `\x1b[2m${msg}\x1b[0m`;

function render() {

	// kaboooooom!
	process.stdout.write("\x1b[H");
	process.stdout.write("kab");

	for (let i = 0; i < numO; i++) {
		process.stdout.write(i === curO ? "O" : "o");
	}

	process.stdout.write("m!\n");

	if (!conf.liveReload) {
		console.log(dim("\n(tip: try use the webview refresh button instead of header run button to view change)"));
	}

	// error stack trace
	if (err) {
		console.log("");
		console.error(red(`ERROR: ${err.msg}`));
		if (err.stack) {
			err.stack.forEach((trace) => {
				console.error(`    -> ${trace.file}:${trace.line}:${trace.col}`);
			});
		}
	}

}
