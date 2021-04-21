// watch dir and rerun process

const cp = require("child_process");
const fs = require("fs");

const target = process.argv[2];
const cmd = process.argv[3];
const args = process.argv.slice(4);

function start() {

	const proc = cp.spawn(cmd, args);

	proc.stdout.on("data", (data) => {
		process.stdout.write(data);
	});

	proc.stderr.on("data", (data) => {
		process.stderr.write(data);
	});

	return proc;

}

let proc = start();

fs.watch(target, {
	recursive: true,
}, (ev, fname) => {
	if (fs.existsSync(fname)) {
		proc.kill("SIGINT");
		proc = start();
	}
});
