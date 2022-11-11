import cp from "child_process"
import fs from "fs/promises"

export const isWindows = /^win/.test(process.platform)
export const isDir = async (path) => (await fs.stat(path)).isDirectory()
export const isFile = async (path) => (await fs.stat(path)).isFile()

export const exec = async (cmd, args, opts) => new Promise((resolve, reject) => {
	const proc = cp.spawn(isWindows ? cmd + ".cmd" : cmd, args, opts)
	proc.on("exit", resolve)
	proc.on("error", reject)
})
