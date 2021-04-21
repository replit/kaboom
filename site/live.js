// live rerun nodejs

const cp = require("child_process");
const fs = require("fs");

function start() {

	const proc = cp.spawn("node", process.argv.slice(2));

	proc.stdout.on("data", (data) => {
		process.stdout.write(data);
	});

	proc.stderr.on("data", (data) => {
		process.stderr.write(data);
	});

	return proc;

}

let proc = start();

fs.watch(".", {
	recursive: true,
}, (ev, fname) => {
	if (fs.existsSync(fname)) {
		proc.kill("SIGINT");
		proc = start();
	}
});
