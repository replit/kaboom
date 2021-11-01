kaboom({
	background: [ 255, 209, 253 ]
})

loadSprite("bean", "/sprites/bean.png")
loadSprite("mark", "/sprites/mark.png")

const dialogues = [
	[ "bean", "hi my butterfly" ],
	[ "bean", "i love u" ],
	[ "bean", "you love me? pretty baby" ],
	[ "bean", "mark is a stupid" ],
	[ "bean", "he did not know how to take care of you..." ],
	[ "mark", "you don't know me ..." ],
	[ "bean", "what! mark???" ],
	[ "mark", "oh...hi " ],
]

let curDialog = 0

const textbox = add([
	rect(width() - 200, 120, { radius: 32 }),
	origin("center"),
	pos(center().x, height() - 100),
	outline(2),
])

const avatar = add([
	sprite("bean"),
	scale(3),
	origin("center"),
	pos(center().sub(0, 50))
])

const txt = add([
	text("", { size: 32, width: width() - 230 }),
	pos(textbox.pos),
	origin("center")
])

onKeyPress("space", () => {
	// Cycle through the dialogues
	curDialog = (curDialog + 1) % dialogues.length
	updateDialog()
})

// Update the on screen sprite & text
function updateDialog() {

	const [ char, dialog ] = dialogues[curDialog]

	// Use a new sprite component to replace the old one
	avatar.use(sprite(char))
	// Update the dialog text
	txt.text = dialog

}

updateDialog()
