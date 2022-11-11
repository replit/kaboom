import cp from "child_process"
import fs from "fs/promises"

export const isWindows = /^win/.test(process.platform)
export const exists = (path) => fs.access(path).then(() => true).catch(() => false)
export const isDir = async (path) => (await fs.stat(path)).isDirectory()
export const isFile = async (path) => (await fs.stat(path)).isFile()
export const c = (n, msg) => `\x1b[${n}m${msg}\x1b[0m`

export const exec = async (cmd, args, opts) => new Promise((resolve, reject) => {
	const proc = cp.spawn(isWindows ? cmd + ".cmd" : cmd, args, opts)
	proc.on("exit", resolve)
	proc.on("error", reject)
})
