// run multiple commands at once

import cp from "child_process";

const opt = {
	stdio: "inherit",
	detached: true,
}

const tasks = process.argv.slice(2).map((arg) => {
	const parts = arg.split(" ")
	return cp.spawn(parts[0], parts.slice(1), opt)
})

process.on("SIGINT", () => {
	tasks.forEach((t) => process.kill(-t.pid))
	process.exit()
})
