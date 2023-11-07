export class Registry<T> extends Map<number, T> {
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
	private handlers: Registry<(...args: Args) => void> = new Registry()
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
	clear() {
		this.handlers.clear()
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
	if (o1 === o2) {
		return true
	}
	const t1 = typeof o1
	const t2 = typeof o2
	if (t1 !== t2) {
		return false
	}
	if (t1 === "object" && t2 === "object" && o1 !== null && o2 !== null) {
		if (Array.isArray(o1) !== Array.isArray(o2)) {
			return false
		}
		const k1 = Object.keys(o1)
		const k2 = Object.keys(o2)
		if (k1.length !== k2.length) {
			return false
		}
		for (const k of k1) {
			const v1 = o1[k]
			const v2 = o2[k]
			if (!deepEq(v1, v2)) {
				return false
			}
		}
		return true
	}
	return false
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
export const getFileExt = (p: string) => p.split(".").pop()
export const getFileName = (p: string) => p.split(".").slice(0, -1).join(".")

type Func = (...args: any[]) => any

export function overload2<A extends Func, B extends Func>(fn1: A, fn2: B): A & B {
	return ((...args) => {
		const al = args.length
		if (al === fn1.length) return fn1(...args)
		if (al === fn2.length) return fn2(...args)
	}) as A & B
}

export function overload3<
	A extends Func,
	B extends Func,
	C extends Func,
>(fn1: A, fn2: B, fn3: C): A & B & C {
	return ((...args) => {
		const al = args.length
		if (al === fn1.length) return fn1(...args)
		if (al === fn2.length) return fn2(...args)
		if (al === fn3.length) return fn3(...args)
	}) as A & B & C
}

export function overload4<
	A extends Func,
	B extends Func,
	C extends Func,
	D extends Func,
>(fn1: A, fn2: B, fn3: C, fn4: D): A & B & C & D {
	return ((...args) => {
		const al = args.length
		if (al === fn1.length) return fn1(...args)
		if (al === fn2.length) return fn2(...args)
		if (al === fn3.length) return fn3(...args)
		if (al === fn4.length) return fn4(...args)
	}) as A & B & C & D
}

export const uid = (() => {
	let id = 0
	return () => id++
})()

export const getErrorMessage = (error: unknown) =>
	(error instanceof Error) ? error.message : String(error)

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

const enum EnumRunesCode {
	HIGH_SURROGATE_START = 0xd800,
	HIGH_SURROGATE_END = 0xdbff,

	LOW_SURROGATE_START = 0xdc00,

	REGIONAL_INDICATOR_START = 0x1f1e6,
	REGIONAL_INDICATOR_END = 0x1f1ff,

	FITZPATRICK_MODIFIER_START = 0x1f3fb,
	FITZPATRICK_MODIFIER_END = 0x1f3ff,

	VARIATION_MODIFIER_START = 0xfe00,
	VARIATION_MODIFIER_END = 0xfe0f,

	DIACRITICAL_MARKS_START = 0x20d0,
	DIACRITICAL_MARKS_END = 0x20ff,

	SUBDIVISION_INDICATOR_START = 0x1f3f4,
	TAGS_START = 0xe0000,
	TAGS_END = 0xe007f,

	ZWJ = 0x200d,
}

const GRAPHEMES = Object.freeze([
	0x0308, // ( ◌̈ ) COMBINING DIAERESIS
	0x0937, // ( ष ) DEVANAGARI LETTER SSA
	0x093F, // ( ि ) DEVANAGARI VOWEL SIGN I
	0x0BA8, // ( ந ) TAMIL LETTER NA
	0x0BBF, // ( ி ) TAMIL VOWEL SIGN I
	0x0BCD, // ( ◌்) TAMIL SIGN VIRAMA
	0x0E31, // ( ◌ั ) THAI CHARACTER MAI HAN-AKAT
	0x0E33, // ( ำ ) THAI CHARACTER SARA AM
	0x0E40, // ( เ ) THAI CHARACTER SARA E
	0x0E49, // ( เ ) THAI CHARACTER MAI THO
	0x1100, // ( ᄀ ) HANGUL CHOSEONG KIYEOK
	0x1161, // ( ᅡ ) HANGUL JUNGSEONG A
	0x11A8, // ( ᆨ ) HANGUL JONGSEONG KIYEOK
])

enum EnumCodeUnits {
	unit_1 = 1,
	unit_2 = 2,
	unit_4 = 4,
}

export function runes(string: string): string[] {
	if (typeof string !== "string") {
		throw new TypeError("string cannot be undefined or null")
	}
	const result: string[] = []
	let i = 0
	let increment = 0
	while (i < string.length) {
		increment += nextUnits(i + increment, string)
		if (isGrapheme(string[i + increment])) {
			increment++
		}
		if (isVariationSelector(string[i + increment])) {
			increment++
		}
		if (isDiacriticalMark(string[i + increment])) {
			increment++
		}
		if (isZeroWidthJoiner(string[i + increment])) {
			increment++
			continue
		}
		result.push(string.substring(i, i + increment))
		i += increment
		increment = 0
	}
	return result
}

// Decide how many code units make up the current character.
// BMP characters: 1 code unit
// Non-BMP characters (represented by surrogate pairs): 2 code units
// Emoji with skin-tone modifiers: 4 code units (2 code points)
// Country flags: 4 code units (2 code points)
// Variations: 2 code units
// Subdivision flags: 14 code units (7 code points)
function nextUnits(i: number, string: string) {
	const current = string[i]
	// If we don't have a value that is part of a surrogate pair, or we're at
	// the end, only take the value at i
	if (!isFirstOfSurrogatePair(current) || i === string.length - 1) {
		return EnumCodeUnits.unit_1
	}

	const currentPair = current + string[i + 1]
	const nextPair = string.substring(i + 2, i + 5)

	// Country flags are comprised of two regional indicator symbols,
	// each represented by a surrogate pair.
	// See http://emojipedia.org/flags/
	// If both pairs are regional indicator symbols, take 4
	if (isRegionalIndicator(currentPair) && isRegionalIndicator(nextPair)) {
		return EnumCodeUnits.unit_4
	}

	// https://unicode.org/emoji/charts/full-emoji-list.html#subdivision-flag
	// See https://emojipedia.org/emoji-tag-sequence/
	// If nextPair is in Tags(https://en.wikipedia.org/wiki/Tags_(Unicode_block)),
	// then find next closest U+E007F(CANCEL TAG)
	if (isSubdivisionFlag(currentPair) &&	isSupplementarySpecialpurposePlane(nextPair)) {
		return string.slice(i).indexOf(String.fromCodePoint(EnumRunesCode.TAGS_END)) + 2
	}

	// If the next pair make a Fitzpatrick skin tone
	// modifier, take 4
	// See http://emojipedia.org/modifiers/
	// Technically, only some code points are meant to be
	// combined with the skin tone modifiers. This function
	// does not check the current pair to see if it is
	// one of them.
	if (isFitzpatrickModifier(nextPair)) {
		return EnumCodeUnits.unit_4
	}
	return EnumCodeUnits.unit_2
}

function isFirstOfSurrogatePair(string: string) {
	return string && betweenInclusive(string[0].charCodeAt(0), EnumRunesCode.HIGH_SURROGATE_START, EnumRunesCode.HIGH_SURROGATE_END)
}

function isRegionalIndicator(string: string) {
	return betweenInclusive(codePointFromSurrogatePair(string), EnumRunesCode.REGIONAL_INDICATOR_START, EnumRunesCode.REGIONAL_INDICATOR_END)
}

function isSubdivisionFlag(string: string) {
	return betweenInclusive(codePointFromSurrogatePair(string),	EnumRunesCode.SUBDIVISION_INDICATOR_START, EnumRunesCode.SUBDIVISION_INDICATOR_START)
}

function isFitzpatrickModifier(string: string) {
	return betweenInclusive(codePointFromSurrogatePair(string), EnumRunesCode.FITZPATRICK_MODIFIER_START, EnumRunesCode.FITZPATRICK_MODIFIER_END)
}

function isVariationSelector(string: string) {
	return typeof string === "string" && betweenInclusive(string.charCodeAt(0), EnumRunesCode.VARIATION_MODIFIER_START, EnumRunesCode.VARIATION_MODIFIER_END)
}

function isDiacriticalMark(string: string) {
	return typeof string === "string" && betweenInclusive(string.charCodeAt(0), EnumRunesCode.DIACRITICAL_MARKS_START, EnumRunesCode.DIACRITICAL_MARKS_END)
}

function isSupplementarySpecialpurposePlane(string: string) {
	const codePoint = string.codePointAt(0)
	return (typeof string === "string" &&	typeof codePoint === "number" && betweenInclusive(codePoint, EnumRunesCode.TAGS_START, EnumRunesCode.TAGS_END))
}

function isGrapheme(string: string) {
	return typeof string === "string" && GRAPHEMES.includes(string.charCodeAt(0))
}

function isZeroWidthJoiner(string: string) {
	return typeof string === "string" && string.charCodeAt(0) === EnumRunesCode.ZWJ
}

function codePointFromSurrogatePair(pair: string) {
	const highOffset = pair.charCodeAt(0) - EnumRunesCode.HIGH_SURROGATE_START
	const lowOffset = pair.charCodeAt(1) - EnumRunesCode.LOW_SURROGATE_START
	return (highOffset << 10) + lowOffset + 0x10000
}

function betweenInclusive(value: number, lower: number, upper: number) {
	return value >= lower && value <= upper
}

export function substring(string: string, start?: number, width?: number) {
	const chars = runes(string)
	if (start === undefined) {
		return string
	}
	if (start >= chars.length) {
		return ""
	}
	const rest = chars.length - start
	const stringWidth = width === undefined ? rest : width
	let endIndex = start + stringWidth
	if (endIndex > (start + rest)) {
		endIndex = undefined
	}
	return chars.slice(start, endIndex).join("")
}
