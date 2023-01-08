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

export class EventController {
	paused: boolean = false
	readonly cancel: () => void
	constructor(cancel: () => void) {
		this.cancel = cancel
	}
	static join(events: EventController[]): EventController {
		const ev = new EventController(() => events.forEach((e) => e.cancel()))
		Object.defineProperty(ev, "paused", {
			get: () => events[0].paused,
			set: (p: boolean) => events.forEach((e) => e.paused = p),
		})
		ev.paused = false
		return ev
	}
}

export class Event<Args extends any[] = any[]> {
	private handlers: IDList<(...args: Args) => void> = new IDList()
	add(action: (...args: Args) => void): EventController {
		const cancel = this.handlers.pushd((...args: Args) => {
			if (ev.paused) return
			action(...args)
		})
		const ev = new EventController(cancel)
		return ev
	}
	addOnce(action: (...args) => void): EventController {
		const ev = this.add((...args) => {
			ev.cancel()
			action(...args)
		})
		return ev
	}
	next(): Promise<Args> {
		return new Promise((res) => this.addOnce(res))
	}
	trigger(...args: Args) {
		this.handlers.forEach((action) => action(...args))
	}
	numListeners(): number {
		return this.handlers.size
	}
}

// TODO: only accept one argument?
export class EventHandler<EventMap extends Record<string, any[]>> {
	private handlers: Partial<{
		[Name in keyof EventMap]: Event<EventMap[Name]>
	}> = {}
	on<Name extends keyof EventMap>(
		name: Name,
		action: (...args: EventMap[Name]) => void,
	): EventController {
		if (!this.handlers[name]) {
			this.handlers[name] = new Event<EventMap[Name]>()
		}
		return this.handlers[name].add(action)
	}
	onOnce<Name extends keyof EventMap>(
		name: Name,
		action: (...args: EventMap[Name]) => void,
	): EventController {
		const ev = this.on(name, (...args) => {
			ev.cancel()
			action(...args)
		})
		return ev
	}
	next<Name extends keyof EventMap>(name: Name): Promise<unknown> {
		return new Promise((res) => {
			// TODO: can only pass 1 val to resolve()
			this.onOnce(name, (...args: EventMap[Name]) => res(args[0]))
		})
	}
	trigger<Name extends keyof EventMap>(name: Name, ...args: EventMap[Name]) {
		if (this.handlers[name]) {
			this.handlers[name].trigger(...args)
		}
	}
	remove<Name extends keyof EventMap>(name: Name) {
		delete this.handlers[name]
	}
	clear() {
		this.handlers = {}
	}
	numListeners<Name extends keyof EventMap>(name: Name): number {
		return this.handlers[name]?.numListeners() ?? 0
	}
}

export function deepEq(o1: any, o2: any): boolean {
	const t1 = typeof o1
	const t2 = typeof o2
	if (t1 !== t2) {
		return false
	}
	if (t1 === "object" && t2 === "object" && o1 !== null && o2 !== null) {
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

export const isDataURL = (str: string) => str.match(/^data:\w+\/\w+;base64,.+/)
export const getExt = (p: string) => p.split(".").pop()

export const uid = (() => {
	let id = 0
	return () => id++
})()

const warned = new Set()

export function warn(msg: string) {
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

export function benchmark(task: () => void, times: number = 1) {
	const t1 = performance.now()
	for (let i = 0; i < times; i++) {
		task()
	}
	const t2 = performance.now()
	return t2 - t1
}

export function comparePerf(t1: () => void, t2: () => void, times: number = 1) {
	return benchmark(t2, times) / benchmark(t1, times)
}

export class BinaryHeap<T> {
	_items: T[]
	_compareFn: (a: T, b: T) => boolean

	/**
	 * Creates a binary heap with the given compare function
	 * Not passing a compare function will give a min heap
	 */
	constructor(compareFn = (a: T, b: T) => a < b) {
		this._compareFn = compareFn
		this._items = []
	}

	/**
	 * Insert an item into the binary heap
	 */
	insert(item: T) {
		this._items.push(item)
		this.moveUp(this._items.length - 1)
	}

	/**
	 * Remove the smallest item from the binary heap in case of a min heap
	 * or the greatest item from the binary heap in case of a max heap
	 */
	remove() {
		if (this._items.length === 0)
			return null
		const item = this._items[0]
		const lastItem = this._items.pop()
		if (this._items.length !== 0) {
			this._items[0] = lastItem as T
			this.moveDown(0)
		}
		return item
	}

	/**
	 * Remove all items
	 */
	clear() {
		this._items.splice(0, this._items.length)
	}

	moveUp(pos: number) {
		while (pos > 0) {
			const parent = Math.floor((pos - 1) / 2)
			if (!this._compareFn(this._items[pos], this._items[parent]))
				if (this._items[pos] >= this._items[parent])
					break
			this.swap(pos, parent)
			pos = parent
		}
	}

	moveDown(pos: number) {
		while (pos < Math.floor(this._items.length / 2)) {
			let child = 2 * pos + 1
			if (child < this._items.length - 1 && !this._compareFn(this._items[child], this._items[child + 1]))
				++child
			if (this._compareFn(this._items[pos], this._items[child]))
				break
			this.swap(pos, child)
			pos = child
		}
	}

	swap(index1: number, index2: number) {
		[this._items[index1], this._items[index2]] = [this._items[index2], this._items[index1]]
	}

	/**
	 * Returns the amount of items
	 */
	get length() {
		return this._items.length
	}
}
