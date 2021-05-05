// watch dir and rerun process

const cp = require("child_process");
const fs = require("fs");

const dir = process.argv[2];
const cmd = process.argv[3];
const args = process.argv.slice(4);
const cwd = process.cwd();

function ansi(n, str) {
	return `\x1b[${n}m${str}\x1b[0m`;
}

if (!dir) {
	console.log(ansi(31, "dir required"));
	process.exit();
}

if (!cmd) {
	console.log(ansi(31, "cmd required"));
	process.exit();
}

console.log(ansi(33, `watching ${cwd}...`));

function start() {
	console.log(ansi(33, `> ${cmd} ${args.join(" ")}`));
	return cp.spawn(cmd, args, {
		stdio: "inherit",
	});
}

let proc = start();

fs.watch(dir, {
	recursive: true,
}, (ev, fname) => {
	if (fs.existsSync(`${dir}/${fname}`)) {
		console.log(ansi(33, `(${new Date().toLocaleTimeString()}) ${fname}`));
		proc.kill();
		proc = start();
	}
});
