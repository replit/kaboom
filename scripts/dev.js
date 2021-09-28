const cp = require("child_process");

// TODO: rsync doc/ assets/ demo/
const jobs = [
	cp.spawn("node", [
		"scripts/watch.js", "src",
		"node", "scripts/build.js"
	], {
		stdio: "inherit",
		detached: true,
	}),
	cp.spawn("node", [
		"scripts/watch.js", "site",
		"node", "site/server.js"
	], {
		stdio: "inherit",
		detached: true,
	}),
];

process.on("SIGINT", () => {
	jobs.forEach((job) => {
		process.kill(-job.pid);
	});
	process.exit();
});
