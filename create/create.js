#!/usr/bin/env node

import fs from "fs";
import cp from "child_process"
import readline from "readline"

const help = `
USAGE:

  $ create-kaboom <dir> [FLAGS]

    or

  $ npm init kaboom <dir> [FLAGS]

FLAGS:

  -t, --typescript   Use typescript
`.trim()

const dest = process.argv[2];
const args = process.argv.slice(3);
const has = (long, short) => args.includes(`--${long}`) || args.includes(`-${short}`)

if (!dest || dest.startsWith("-")) {
	console.error(`Please specify a directory to create the kaboom project!\n\n${help}`)
	process.exit(1)
}

if (fs.existsSync(dest)) {
	console.error(`Directory "${dest}" already exists!`)
	process.exit(1)
}

const ts = has("typescript", "t")

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
	file("package.json", JSON.stringify({
		"name": dest,
		"scripts": {
			"dev": "vite",
			"build": "vite build",
			"preview": "vite preview",
			...(ts ? {
				"check": "tsc --noEmit game.ts",
			} : {}),
		},
		"dependencies": {
			"kaboom": "^2000.2.3",
		},
		"devDependencies": {
			"vite": "^2.7.13",
			...(ts ? {
				"typescript": "^4.5.5",
			} : {}),
		},
	}, null, "\t")),
	file("index.html", `
<!DOCTYPE html>

<html>

<head>
	<title>draw</title>
</head>

<body>
	<script type="module" src="/game.${ts ? "ts" : "js"}"></script>
</body>

</html>
	`),
	file(`game.${ts ? "ts" : "js"}`, `
import kaboom from "kaboom"

kaboom()
	`),
])

const create = (dir) => {
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

and start editing game.${ts ? "ts" : "js"}!
	`.trim())
})
