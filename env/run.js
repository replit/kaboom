const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

function build() {

	const template = fs.readFileSync("template.html", "utf-8");
	const conf = JSON.parse(fs.readFileSync("conf.json", "utf-8"));
	let code = "";

	// report error back to server to log
	code += `<script>
window.addEventListener("error", (e) => {
	fetch("/error", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			msg: e.error.message,
			stack: e.error.stack,
			file: e.filename,
			lineno: e.lineno,
			colno: e.colno,
		}),
	});
});
</script>`;

	const libFiles = [
		"lib/kaboom.js",
		"lib/plugins/pedit.js",
		"lib/plugins/aseprite.js",
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

	// build code
	esbuild.buildSync({
		bundle: true,
		sourcemap: true,
		target: "es6",
		minify: true,
		keepNames: true,
		entryPoints: fs.readdirSync("code").map((f) => `code/${f}`),
		outdir: "dist",
	});

	fs.readdirSync("dist").forEach((file) => {
		if (file.endsWith(".js")) {
			code += `<script src="/dist/${file}"></script>\n`;
		}
	});

	fs.writeFileSync("dist/index.html", template.replace("{{kaboom}}", code));

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
]);

app.use(express.json());

app.get("/", (req, res) => {
	if (watcher.changed()) {
		build();
		watcher.push();
	}
	res.sendFile(__dirname + "/dist/index.html");
});

app.post("/error", (req, res) => {
	console.error(req.body.stack);
});

app.use("/sprites", express.static("sprites"));
app.use("/sounds", express.static("sounds"));
app.use("/dist", express.static("dist"));
app.use("/lib", express.static("lib"));

app.listen(port);
