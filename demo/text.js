kaboom()

// Add a game object with text() component + options
const input = add([
	text("Please type! Or press up and down to cycle fonts", {
		// It'll wrap to next line if the text width exceeds the width option specified here
		width: width(),
		// The height of character
		size: 32,
		// Transform each character for special effects
		transform: (idx, ch) => {
			return {
				color: hsl2rgb(((time() * 60 + idx * 20) % 255) / 255, 0.7, 0.8),
				scale: wave(1, 1.2, time() * 3 + idx),
				angle: wave(-9, 9, time() * 3 + idx),
			}
		},
	}),
])

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
onKeyPress("up", () => {
	if (--curFont < 0) curFont = fonts.length - 1
	input.font = fonts[curFont]
})

// Go to next font
onKeyPress("down", () => {
	curFont = (curFont + 1) % fonts.length
	input.font = fonts[curFont]
})
