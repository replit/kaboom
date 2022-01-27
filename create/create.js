#!/usr/bin/env node

import fs from "fs";
import cp from "child_process"
import https from "https"

const help = `
USAGE:

  $ create-kaboom [OPTIONS] <dir>

    or

  $ npm init kaboom [OPTIONS] <dir>

OPTIONS:

  -h, --help          Print this message
  -t, --typescript    Use typescript
  -s, --start         Start the dev server right away
  -d, --demo <name>   Start from a demo listed on kaboomjs.com/play
`.trim()

const fail = (msg) => {
	console.error(msg)
	process.exit(1)
}

const optMap = [
	{ long: "demo", short: "d", type: "value", },
	{ long: "typescript", short: "t", type: "flag", },
	{ long: "start", short: "s", type: "flag", },
	{ long: "help", short: "h", type: "flag", },
]

const opts = {}
const args = []

iter: for (let i = 2; i < process.argv.length; i++) {
	const arg = process.argv[i];
	if (arg.startsWith("-")) {
		for (const opt of optMap) {
			if (arg === `--${opt.long}` || arg === `-${opt.short}`) {
				if (opt.type === "flag") {
					opts[opt.long] = true
				} else if (opt.type === "value")  {
					const val = process.argv[++i]
					if (!val) {
						fail(`Expected value after ${arg}`)
					}
					opts[opt.long] = val
				}
				continue iter
			}
		}
		fail(`Unknown option "${arg}"\n\n${help}`)
	} else {
		args.push(arg)
	}
}

if (opts["help"]) {
	console.log(help)
	process.exit()
}

const dest = args[0]

if (!dest) {
	fail(`Please specify a directory to create the kaboom project!\n\n${help}`)
}

if (fs.existsSync(dest)) {
	fail(`Directory "${dest}" already exists!`)
}

const ts = opts["typescript"]

const fetch = async (opt) => new Promise((resolve) => {

	const req = https.request(opt, (res) => {
		res.on("data", resolve)
	})

	req.on("error", fail)
	req.end()

})

const exec = async (cmd, args, opts) => new Promise((resolve) => {
	const proc = cp.spawn(cmd, args, opts)
	proc.on("exit", resolve)
	proc.on("error", fail)
})

let startCode = `
import kaboom from "kaboom"

kaboom()

loadBean()

add([
	pos(120, 80),
	sprite("bean"),
])

onClick(() => addKaboom(mousePos()))
`.trim()

// TODO: support pulling assets used by demo
if (opts["demo"]) {

	const demo = await fetch({
		hostname: "raw.githubusercontent.com",
		path: `replit/kaboom/master/demo/${opts["demo"]}.js`,
		method: "GET",
	})

	startCode = `import kaboom from "kaboom"\n\n` + demo.toString().trim()

}

const file = (name, content) => ({
	type: "file",
	name,
	content: content.trim(),
})

const dir = (name, items) => ({
	type: "dir",
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
	file(`game.${ts ? "ts" : "js"}`, startCode),
])

const create = (dir) => {
	fs.mkdirSync(dir.name)
	process.chdir(dir.name)
	for (const item of dir.items) {
		if (item.type === "dir") {
			create(item)
		} else if (item.type === "file") {
			fs.writeFileSync(item.name, item.content)
		}
	}
	process.chdir("..")
}

create(template)
process.chdir(dest)

await exec("npm", [ "install", ], { stdio: "inherit", })

if (opts["start"]) {
	await exec("npm", [ "run", "dev", ], { stdio: "inherit", })
} else {
	console.log("")
	console.log(`
Success! Now

  $ cd ${dest}
  $ npm run dev

and start editing game.${ts ? "ts" : "js"}!
	`.trim())
}
