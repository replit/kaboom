const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const express = require("express");
const StackTrace = require("stacktrace-js");
const app = express();
const port = process.env.PORT || 8000;

function build() {

	const template = fs.readFileSync("template.html", "utf-8");
	const conf = JSON.parse(fs.readFileSync("conf.json", "utf-8"));
	let code = "";

	// kaboom lib files
	const libFiles = [
		"lib/err.js",
		"lib/kaboom.js",
		"lib/plugins/pedit.js",
		"lib/plugins/aseprite.js",
	];

	libFiles.forEach((f) => {
		code += `<script src="/${f}"></script>\n`;
	});

	code += `<script src="/dist/lib.js"></script>\n`;
	code += "<script>\n";

	// kaboom init
	code += `
kaboom({
...${JSON.stringify(conf)},
global: true,
plugins: [ peditPlugin, asepritePlugin, ],
});\n`;

	// assets loading
	fs.readdirSync("sprites").forEach((file) => {
		const ext = path.extname(file);
		const name = JSON.stringify(path.basename(file, ext));
		const pp = JSON.stringify(`/sprites/${file}`);
		if (ext === ".pedit") {
			code += `loadPedit(${name}, ${pp});\n`;
		} else {
			code += `loadSprite(${name}, ${pp});\n`;
		}
	});

	fs.readdirSync("sounds").forEach((file) => {
		const name = JSON.stringify(path.basename(file, path.extname(file)));
		const pp = JSON.stringify(`/sounds/${file}`);
		code += `loadSound(${name}, ${pp});\n`;
	});

	code += "</script>\n";

	// build user code
	esbuild.buildSync({
		bundle: true,
		sourcemap: true,
		target: "es6",
		minify: true,
		keepNames: true,
		entryPoints: fs.readdirSync("code").map((f) => `code/${f}`),
		outdir: "dist",
	});

	fs.readdirSync("code").forEach((file) => {
		code += `<script src="/dist/${file}"></script>\n`;
	});

	fs.writeFileSync("dist/index.html", template.replace("{{kaboom}}", code));

}

function buildPre() {
	// build pre code
	esbuild.buildSync({
		bundle: true,
		sourcemap: true,
		target: "es6",
		minify: true,
		keepNames: true,
		entryPoints: ["pre.js"],
		outfile: "dist/lib.js",
	});
}

function watch(paths) {
	const getTimes = () => paths.map((p) => fs.statSync(p).mtime.getTime());
	let times = getTimes();
	return {
		changed() {
			const curTimes = getTimes();
			for (let i = 0; i < times.length; i++) {
				if (times[i] != curTimes[i]) {
					return true;
				}
			}
			return false;
		},
		push() {
			times = getTimes();
		},
	};
}

const watcher = watch([
	"code",
	"sprites",
	"sounds",
	"template.html",
	"conf.json",
]);

build();
buildPre();
app.use(express.json());

app.get("/", (req, res) => {
	if (watcher.changed()) {
		build();
		watcher.push();
	}
	res.sendFile(__dirname + "/dist/index.html");
	reset();
});

app.post("/error", (req, res) => {
	const url = req.protocol + "://" + req.get("host") + "/";
	err = req.body;
	render();
});

app.use("/sprites", express.static("sprites"));
app.use("/sounds", express.static("sounds"));
app.use("/dist", express.static("dist"));
app.use("/lib", express.static("lib"));

app.listen(port, reset);

// term output
let numO = 2;
let curO = null;
let anim = null;
let anim2 = null;
let err = null;
const MAX_O = 32;
const INC_SPEED = 10000;
const ROLL_SPEED_MIN = 200;
const ROLL_SPEED_MAX = 50;

function reset() {
	clearTimeout(anim);
	clearTimeout(anim2);
	curO = null;
	err = null;
	anim = setTimeout(next, INC_SPEED);
	process.stdout.write("\x1b[2J");
	render();
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

function render() {
	process.stdout.write("\x1b[H");
	process.stdout.write("kab");
	for (let i = 0; i < numO; i++) {
		process.stdout.write(i === curO ? "O" : "o");
	}
	process.stdout.write("m!\n");
	if (err) {
		console.log("");
		console.error(red(`ERROR: ${err.msg}`));
		err.stack.forEach((trace) => {
			if (trace.functionName) {
				console.error(`  -> ${yellow(`${trace.functionName}()`)}`);
			} else {
				console.error(`  -> ${yellow("<root>")}`);
			}
			console.error(`    ${trace.fileName}:${trace.lineNumber}:${trace.columnNumber}`);
		});
	}
}
