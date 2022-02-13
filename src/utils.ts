import { EventCanceller } from "./types"

export class IDList<T> extends Map<number, T> {
	private lastID: number
	constructor(...args) {
		super(...args)
		this.lastID = 0
	}
	push(v: T): number {
		const id = this.lastID
		this.set(id, v)
		this.lastID++
		return id
	}
	pushd(v: T): () => void {
		const id = this.push(v)
		return () => this.delete(id)
	}
}

export class Event<Args extends any[] = any[]> {
	private handlers: IDList<(...args: Args) => void> = new IDList()
	add(action: (...args: Args) => void): EventCanceller {
		return this.handlers.pushd(action)
	}
	addOnce(action: (...args) => void): EventCanceller {
		const cancel = this.add((...args) => {
			action(...args)
			cancel()
		})
		return cancel
	}
	trigger(...args: Args) {
		this.handlers.forEach((action) => action(...args))
	}
	numListeners(): number {
		return this.handlers.size
	}
}

// TODO: be able to type each event
export class EventHandler<E = string> {
	private handlers: Map<E, Event> = new Map()
	on(name: E, action: (...args) => void): EventCanceller {
		if (!this.handlers.get(name)) {
			this.handlers.set(name, new Event())
		}
		return this.handlers.get(name).add(action)
	}
	onOnce(name: E, action: (...args) => void): EventCanceller {
		const cancel = this.on(name, (...args) => {
			action(...args)
			cancel()
		})
		return cancel
	}
	trigger(name: E, ...args) {
		if (this.handlers.get(name)) {
			this.handlers.get(name).trigger(...args)
		}
	}
	remove(name: E) {
		this.handlers.delete(name)
	}
	clear() {
		this.handlers = new Map()
	}
	numListeners(name: E): number {
		return this.handlers.get(name)?.numListeners() ?? 0
	}
}

export function deepEq(o1: any, o2: any): boolean {
	const t1 = typeof o1
	const t2 = typeof o2
	if (t1 !== t2) {
		return false
	}
	if (t1 === "object" && t2 === "object") {
		const k1 = Object.keys(o1)
		const k2 = Object.keys(o2)
		if (k1.length !== k2.length) {
			return false
		}
		for (const k of k1) {
			const v1 = o1[k]
			const v2 = o2[k]
			if (!(typeof v1 === "function" && typeof v2 === "function")) {
				if (!deepEq(v1, v2)) {
					return false
				}
			}
		}
		return true
	}
	return o1 === o2
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
	const binstr = window.atob(base64)
	const len = binstr.length
	const bytes = new Uint8Array(len)
	for (let i = 0; i < len; i++) {
		bytes[i] = binstr.charCodeAt(i)
	}
	return bytes.buffer
}

export function dataURLToArrayBuffer(url: string): ArrayBuffer {
	return base64ToArrayBuffer(url.split(",")[1])
}

export function download(filename: string, url: string) {
	const a = document.createElement("a")
	a.href = url
	a.download = filename
	a.click()
}

export function downloadText(filename: string, text: string) {
	download(filename, "data:text/plain;charset=utf-8," + text)
}

export function downloadJSON(filename: string, data: any) {
	downloadText(filename, JSON.stringify(data))
}

export function downloadBlob(filename: string, blob: Blob) {
	const url = URL.createObjectURL(blob)
	download(filename, url)
	URL.revokeObjectURL(url)
}

export function isDataURL(str: string) {
	return str.match(/^data:\w+\/\w+;base64,.+/)
}

export const uid = (() => {
	let id = 0
	return () => id++
})()

const warned = new Set()

export function warn(msg) {
	if (!warned.has(msg)) {
		warned.add(msg)
		console.warn(msg)
	}
}

export function deprecateMsg(oldName: string, newName: string) {
	warn(`${oldName} is deprecated. Use ${newName} instead.`)
}

export function deprecate(oldName: string, newName: string, newFunc: (...args) => any) {
	return (...args) => {
		deprecateMsg(oldName, newName)
		return newFunc(...args)
	}
}

export function benchmark(task: () => any, times: number = 1) {
	const t1 = performance.now()
	for (let i = 0; i < times; i++) {
		task()
	}
	const t2 = performance.now()
	return t2 - t1
}
