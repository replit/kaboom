/**
 * Loads and merges multiple images from given URLs.
 * Images must have same size as first image, to get drawn over previously merged images.
 *
 * The returned Promise<ImageData> can be used in loadSprite and loadSpriteAtlas as src-parameter
 *
 * @param {string[]} urls - URLs of images to merge
 * @returns Promise<ImageData>
 */
function mergeImg(urls) {
	return Promise.all(urls.map((url) => new Promise((resolve, reject) => {
		const img = new Image()
		img.src = url
		img.crossOrigin = "anonymous"
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error(`Failed to load ${url}`))
	}))).then((images) => {
		const canvas = document.createElement("canvas")
		const width = images[0].width
		const height = images[0].height
		canvas.width = width
		canvas.height = height
		const ctx = canvas.getContext("2d")
		images.forEach((img, i) => {
			if (img.width === width && img.height === height) {
				ctx.drawImage(img, 0, 0)
			}
		})
		return ctx.getImageData(0, 0, width, height)
	})
}

// Start a kaboom game
kaboom({
	// Scale the whole game up
	scale: 2,
	// Set the default font
	font: "sinko",
})

// animationsettings in Spriteatlas
const anims = {
	x: 0,
	y: 0,
	height: 1344,
	width: 832,
	sliceX: 13,
	sliceY: 21,
	anims: {
		"walk-up": {from: 104, to: 112},
		"walk-left": {from: 117, to: 125},
		"walk-down": {from: 130, to: 138},
		"walk-right": {from: 143, to: 151},
		"idle-up": {from: 104, to: 104},
		"idle-left": {from: 117, to: 117},
		"idle-down": {from: 130, to: 130},
		"idle-right": {from: 143, to: 143},
	},
}

const playerAnims = {
	player: anims,
}

const chestAnims = {
	chest: anims,
}

const corpusAnims = {
	corpus: anims,
}

// Sprites are taken from https://github.com/gaconkzk/Universal-LPC-spritesheet
// under Licenses GNU GPL 3.0 (http://creativecommons.org/licenses/by-sa/3.0/) and CC-BY-SA 3.0 (http://www.gnu.org/licenses/gpl-3.0.html)
// load Spriteatlas with leather armor
loadSpriteAtlas("/sprites/spritemerge_chest.png", chestAnims)
// load Spriteatlas with body
loadSpriteAtlas("/sprites/spritemerge_corpus.png", corpusAnims)
// load and merge body and leather armor
load(
	mergeImg(["/sprites/spritemerge_corpus.png", "/sprites/spritemerge_chest.png"])
		.then((img) => loadSpriteAtlas(img, playerAnims)),
)

let DIRECTION = "down"

gravity(0)

// Add our player character with body and leather armor spriteatlas
const player = add([
	sprite("player"),
	pos(center()),
	origin("center"),
	area(),
	body(),
])

// add only body
const corpus = add([
	sprite("corpus"),
	pos(center().add(-128, 0)),
	origin("center"),
	area(),
	body(),
])

// add only leather armor
const chest = add([
	sprite("chest"),
	pos(center().add(128, 0)),
	origin("center"),
	area(),
	body(),
])

// .play is provided by sprite() component, it starts playing the specified animation (the animation information of "idle" is defined above in loadSprite)
player.play("idle-down")
chest.play("idle-down")
corpus.play("idle-down")


// provide movementanimations
onKeyDown("left", () => {
	DIRECTION = "left"
	switchAnimation("walk")
})

onKeyDown("right", () => {
	DIRECTION = "right"
	switchAnimation("walk")
})

onKeyDown("down", () => {
	DIRECTION = "down"
	switchAnimation("walk")
})

onKeyDown("up", () => {
	DIRECTION = "up"
	switchAnimation("walk")
})

onKeyRelease(["left", "right", "down", "up"], () => {
	switchAnimation("idle")
})

function switchAnimation(type) {
	if (player.curAnim() !== type+"-"+DIRECTION) {
		player.play(type+"-"+DIRECTION, {loop: true})
		chest.play(type+"-"+DIRECTION, {loop: true})
		corpus.play(type+"-"+DIRECTION, {loop: true})
	}
}


const getInfo = () => `
Anim: ${player.curAnim()}
Frame: ${player.frame}
`.trim()

// Add some text to show the current animation
const label = add([
	text(getInfo()),
	pos(4),
])

label.onUpdate(() => {
	label.text = getInfo()
})
