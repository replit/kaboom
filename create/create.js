#!/usr/bin/env node

import fs from "fs";
import cp from "child_process"
import https from "https"

const fail = (msg) => {
	console.error(msg)
	process.exit(1)
}

const optMap = [
	{ long: "help", short: "h", desc: "Print this message", },
	{ long: "typescript", short: "t", desc: "Use TypeScript", },
	{ long: "start", short: "s", desc: "Start the dev server right away", },
	{ long: "demo", short: "d", value: "name", desc: "Start from a demo listed on kaboomjs.com/play", },
	{ long: "version", short: "v", value: "v", desc: "Use a specific kaboom version", },
]

const optDisplay = optMap.map((opt) => ({
	usage: `-${opt.short} --${opt.long}${opt.value ? ` <${opt.value}>` : ""}`,
	desc: opt.desc,
}));

const usageLen = optDisplay.reduce((len, dis) => dis.usage.length > len ? dis.usage.length : len, 0)

const help = `
USAGE:

  $ create-kaboom [OPTIONS] <dir>

    or

  $ npm init kaboom -- [OPTIONS] <dir>

OPTIONS:

  ${optDisplay.map((opt) => `${opt.usage} ${" ".repeat(usageLen - opt.usage.length)} ${opt.desc}`).join("\n  ")}
`.trim()

const opts = {}
const args = []

iter: for (let i = 2; i < process.argv.length; i++) {
	const arg = process.argv[i];
	if (arg.startsWith("-")) {
		for (const opt of optMap) {
			if (arg === `--${opt.long}` || arg === `-${opt.short}`) {
				if (opt.value) {
					const val = process.argv[++i]
					if (!val) {
						fail(`Expected value after ${arg}`)
					}
					opts[opt.long] = val
				} else {
					opts[opt.long] = true
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

const pkgs = [
	`kaboom@${opts["version"] ?? "latest"}`,
]

const devPkgs = [
	"vite@latest",
	...(ts ? [ "typescript@latest" ] : []),
]

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

await exec("npm", [ "install", ...pkgs, ], { stdio: "inherit", })
await exec("npm", [ "install", "-D", ...devPkgs, ], { stdio: "inherit", })

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
