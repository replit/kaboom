const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

// build user game
function buildGame() {

	const template = fs.readFileSync("template.html", "utf-8");
	const conf = JSON.parse(fs.readFileSync("conf.json", "utf-8"));
	let code = "";

	// kaboom lib files
	const libFiles = [
		"dist/kaboom.js",
		"dist/helper.js",
	];

	libFiles.forEach((f) => {
		code += `<script src="/${f}"></script>\n`;
	});

	code += "<script>\n";

	// kaboom init
	code += `
kaboom({
...${JSON.stringify(conf)},
global: true,
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

// build kaboom library
function buildKaboom() {

	const fmts = [
		{ format: "iife", ext: "js",  },
		{ format: "cjs",  ext: "cjs", },
		{ format: "esm",  ext: "mjs", },
	];

	const srcDir = "kaboom";
	const distDir = "dist";

	fmts.forEach((fmt) => {

		const srcPath = `${srcDir}/kaboom.ts`;
		const distPath = `${distDir}/kaboom.${fmt.ext}`;

		esbuild.buildSync({
			bundle: true,
			sourcemap: true,
			target: "es6",
			minify: true,
			keepNames: true,
			loader: {
				".png": "dataurl",
				".glsl": "text",
				".mp3": "binary",
			},
			entryPoints: [ srcPath ],
			globalName: "kaboom",
			format: fmt.format,
			outfile: distPath,
		});

	});

}

// build kaboom env helper script
function buildHelper() {
	esbuild.buildSync({
		bundle: true,
		sourcemap: true,
		target: "es6",
		minify: true,
		keepNames: true,
		entryPoints: ["helper.ts"],
		outfile: "dist/helper.js",
	});
}

// returns a check function that executes the passed func if passed files are
// modified since last check
function watch(paths, exec) {
	const getMtimes = () => paths.map((p) => fs.statSync(p).mtime.getTime());
	let mtimes = getMtimes();
	return () => {
		const curMtimes = getMtimes();
		for (let i = 0; i < mtimes.length; i++) {
			if (mtimes[i] != curMtimes[i]) {
				return exec();
			}
		}
		mtimes = curMtimes;
		return null;
	};
}

const checkBuildGame = watch([
	"code",
	"sprites",
	"sounds",
	"template.html",
	"conf.json",
], buildGame);

const checkBuildKaboom = watch([
	"kaboom",
], buildKaboom);

// initial build
buildGame();
buildHelper();
buildKaboom();

// server stuff
app.use(express.json());

app.get("/", (req, res) => {
	checkBuildGame();
	checkBuildKaboom();
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
