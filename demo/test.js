kaboom()

let curTest = null

function test(name, action) {
	curTest = {
		name: name,
		step: 0,
	}
	action()
	curTest = null
}

const makeAssert = (action) => ((val) => {
	if (!curTest) {
		throw new Error("assert() cannot be called outside a test")
	}
	if (!action(val)) {
		const e = new Error()
		const match = e.stack.split("\n")[2].match(/at\s(?<path>.+):(?<line>\d+):\d+$/)
		if (match) {
			throw new Error(`Test "${curTest.name}" failed at line ${match.groups.line}`)
		} else {
			throw new Error(`Test "${curTest.name}" failed`)
		}
	}
})

const assert = makeAssert((v) => v)

const assertThrow = makeAssert((action) => {
	let didThrow = false
	try {
		action()
	} catch (e) {
		didThrow = true
	}
	return didThrow
})

test("object count", () => {

	const a = add([])

	assert(getAll().length === 1)
	assert(get().length === 1)

	add([])

	assert(getAll().length === 2)
	assert(get().length === 2)

	const b = a.add([ "flower" ])
	a.add([ "flower" ])

	assert(b.parent === a)
	assert(a.isAncestorOf(b))
	assert(a.children[0] === b)
	assert(getAll().length === 4)
	assert(get().length === 2)
	assert(get("flower").length === 0)
	assert(getAll("flower").length === 2)
	assert(a.get("flower").length === 2)
	assert(a.getAll("flower").length === 2)
	assert(a.exists())
	assert(b.exists())

	a.destroy()

	assert(!a.exists())
	assert(!b.exists())
	assert(getAll().length === 1)
	assert(get().length === 1)

	a.use(rect(24, 12))

	assert(a.c("rect").width === 24)
	assert(a.is("rect"))
	assert(a.width === 24)
	assert(a.height === 12)

	a.unuse("rect")

	assert(a.c("rect") === undefined)
	assert(!a.is("rect"))
	assert(a.width === undefined)
	assert(a.height === undefined)

})
