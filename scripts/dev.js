const cp = require("child_process");

const t1 = cp.spawn("node", [
	"scripts/watch.js", "src",
	"npm", "--silent", "run", "build"
], {
	stdio: "inherit",
	detached: true,
});

const t2 = cp.spawn("node", [
	"../scripts/watch.js", ".",
	"node", "src/server.js"
], {
	stdio: "inherit",
	detached: true,
	cwd: "site",
});

process.on("SIGINT", () => {
	process.kill(-t1.pid);
	process.kill(-t2.pid);
	process.exit();
});
