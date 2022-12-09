import { exec, exists, c } from "./utils.js"
import fs from "fs/promises"

const example = process.argv[2] ?? "add"
const info = (msg) => console.log(c(33, msg))

if (!(await exists("bin"))) {
	info("- downloading neutralino packages")
	await exec("neu", [ "update" ], { stdio: [ "inherit", "ignore", "inherit" ] })
}

await exec("npm", [ "run", "build" ])

if (!(await exists("desktop"))) {
	info("- creating desktop/")
	await fs.mkdir("desktop")
}

info("- creating desktop/index.html")
await fs.writeFile("desktop/index.html", `
<!DOCTYPE html>
<html>
<head>
	<title>test</title>
</head>
<body>
	<script src="kaboom.js"></script>
	<script src="examples/${example}.js"></script>
</body>
</html>
`.trim())

info("- copying desktop/kaboom.js")
await fs.copyFile("dist/kaboom.js", "desktop/kaboom.js")
info("- copying desktop/icon.png")
await fs.copyFile("sprites/k.png", "desktop/icon.png")
info("- copying desktop/examples")
await fs.cp("examples", "desktop/examples", { recursive: true })
info("- copying desktop/sprites")
await fs.cp("sprites", "desktop/sprites", { recursive: true })
info("- running desktop app")
await exec("neu", [ "run" ], { stdio: [ "inherit", "ignore", "inherit" ] })
