const keys = [
	"f1", "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=",
	"q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\",
	"a", "s", "d", "f", "g", "h", "j", "k", "l", "", "'",
	"z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
	"backspace", "enter", "tab", " ",
	"ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
]

const el = canvas || k?.canvas

if (!el) {
	throw new Error("Can't find kaboom canvas")
}

setTimeout(() => {
	for (const key of keys) {
		canvas.dispatchEvent(new KeyboardEvent("keydown", {
			key: key,
		}))
	}
	canvas.dispatchEvent(new MouseEvent("mousemove", {
		clientX: 120,
		clientY: 160,
	}))
	for (let i = 0; i < 4; i++) {
		canvas.dispatchEvent(new MouseEvent("mousedown", {
			button: i,
		}))
	}
}, 500)

setTimeout(() => {
	for (const key of keys) {
		canvas.dispatchEvent(new KeyboardEvent("keyup", {
			key: key,
		}))
	}
	canvas.dispatchEvent(new MouseEvent("mousemove", {
		clientX: 240,
		clientY: 120,
	}))
	for (let i = 0; i < 4; i++) {
		canvas.dispatchEvent(new MouseEvent("mouseup", {
			button: i,
		}))
	}
}, 1200)
