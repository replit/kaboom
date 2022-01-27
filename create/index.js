#!/usr/bin/env node

import fs from "fs";
import cp from "child_process"
import readline from "readline"

const dest = process.argv[2];

if (!dest) {
	console.error(`
Please specify a directory to create the kaboom project!

  $ npm init kaboom <name>
	`.trim())
	process.exit(1)
}

if (fs.existsSync(dest)) {
	console.error(`Directory "${dest}" already exists!`)
	process.exit(1)
}

const file = (name, content) => ({
	kind: "file",
	name,
	content: content.trim(),
})

const dir = (name, items) => ({
	kind: "dir",
	name,
	items,
})

const template = dir(dest, [
	file("package.json", `
{
	"name": "kaboomdraw",
	"scripts": {
		"dev": "vite",
		"build": "vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"kaboom": "^2000.2.2"
	},
	"devDependencies": {
		"vite": "^2.7.13"
	}
}
	`),
	file("index.html", `
<!DOCTYPE html>

<html>

<head>
	<title>draw</title>
</head>

<body>
	<script type="module" src="/src/main.js"></script>
</body>

</html>
	`),
	file("game.js", `
import kaboom from "kaboom"

kaboom()
	`),
])

function create(dir) {
	fs.mkdirSync(dir.name)
	process.chdir(dir.name)
	for (const item of dir.items) {
		if (item.kind === "dir") {
			create(item)
		} else if (item.kind === "file") {
			fs.writeFileSync(item.name, item.content)
		}
	}
	process.chdir("..")
}

create(template)
process.chdir(dest)
const install = cp.spawn("npm", [ "install" ], { stdio: "inherit", })

install.on("exit", () => {
	console.log("")
	console.log(`
Success! Now

  $ cd ${dest}
  $ npm run dev

and start editing game.js!
	`.trim())
})
