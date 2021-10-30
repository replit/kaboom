kaboom()

// Load custom bitmap font, specifying the width and height of each character in the image
loadFont("unscii", "fonts/unscii_8x8.png", 8, 8)

// List of built-in fonts ("o" at the end means the outlined version)
const builtinFonts = [
	"apl386o",
	"apl386",
	"sinko",
	"sink",
]

// Make a list of fonts that we cycle through
const fonts = [
	...builtinFonts,
	"unscii"
]

// Keep track which is the current font
let curFont = 0
let curSize = 48

// Add a game object with text() component + options
const input = add([
	text("Type! And try arrow keys!", {
		// What font to use
		font: fonts[curFont],
		// It'll wrap to next line if the text width exceeds the width option specified here
		width: width(),
		// The height of character
		size: curSize,
		// Transform each character for special effects
		transform: (idx, ch) => ({
			color: hsl2rgb(((time() * 60 + idx * 20) % 255) / 255, 0.7, 0.8),
			scale: wave(1, 1.2, time() * 3 + idx),
			angle: wave(-9, 9, time() * 3 + idx),
		}),
	}),
])

// Like onKeyPressRepeat() but more suitable for text input.
onCharInput((ch) => {
	input.text += ch
})

// Like onKeyPress() but will retrigger when key is being held (which is similar to text input behavior)
// Insert new line when user presses enter
onKeyPressRepeat("enter", () => {
	input.text += "\n"
})

// Delete last character
onKeyPressRepeat("backspace", () => {
	input.text = input.text.substring(0, input.text.length - 1)
})

// Go to previous font
onKeyPress("left", () => {
	if (--curFont < 0) curFont = fonts.length - 1
	input.font = fonts[curFont]
})

// Go to next font
onKeyPress("right", () => {
	curFont = (curFont + 1) % fonts.length
	input.font = fonts[curFont]
})

const SIZE_SPEED = 32
const SIZE_MIN = 12
const SIZE_MAX = 120

// Increase text size
onKeyDown("up", () => {
	curSize = Math.min(curSize + dt() * SIZE_SPEED, SIZE_MAX)
	input.textSize = curSize
})

// Decrease text size
onKeyDown("down", () => {
	curSize = Math.max(curSize - dt() * SIZE_SPEED, SIZE_MIN)
	input.textSize = curSize
})
