import { exec, isDir } from "./utils.js"
import fs from "fs/promises"

const example = process.argv[2] ?? "add"

if (!(await isDir("bin"))) {
	await exec("npx", [ "neu", "update" ])
}

await exec("npm", [ "run", "build" ])

if (!(await isDir("desktop"))) {
	await fs.mkdir("desktop")
}

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

await fs.copyFile("dist/kaboom.js", "desktop/kaboom.js")
await fs.copyFile("sprites/k.png", "desktop/icon.png")
await fs.cp("examples", "desktop/examples", { recursive: true })
await fs.cp("sprites", "desktop/sprites", { recursive: true })
await exec("npx", [ "neu", "run" ])
