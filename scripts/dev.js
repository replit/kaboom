import cp from "child_process";

const run = (name) => cp.spawn(
	"npm",
	["run", name, "--silent"],
	{
		stdio: "inherit",
		detached: true,
		env: {
			...process.env,
			NODE_ENV: "development",
		},
	}
);

const tasks = [
	run("build"),
	run("site"),
];

process.on("SIGINT", () => {
	tasks.forEach((t) => {
		process.kill(-t.pid);
	});
	process.exit();
});
