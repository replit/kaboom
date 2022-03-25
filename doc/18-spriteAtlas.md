# Sprite Atlas with Kaboom

In this tutorial, we will learn how to create game objects from a sprite atlas and how we can animate them and add unique behaviors for them.

![spriteAtlas](spriteatlas.png)

You can find the code for this tutorial at this [link](https://replit.com/@ritza/spriteAtlas-1).


## Getting started with the code
To begin, let's initialize a kaboom context. Add the following code to your program:

```javascript
kaboom({
	scale: 3,
	background: [100, 168, 50],
})
```
This code will scale up the size of our context so that our sprites seem bigger and add a nice green background to it.


## Importing Sprites

Sprite Atlas is an image containing a batch of smaller images that have the same size but varying dimensions.
The smaller images are obtained using custom texture coordinates to pick them out of the atlas.

Let's import the "dungeon" image from Kaboom. Add the following code block of code:

```javascript
loadSpriteAtlas("/sprites/dungeon.png", {
	"hero": {
		"x": 128,
		"y": 196,
		"width": 144,
		"height": 28,
		"sliceX": 9,
		"anims": {
			"idle": {
				"from": 0,
				"to": 3,
				"speed": 3,
				"loop": true
			},
			"run": {
				"from": 4,
				"to": 7,
				"speed": 10,
				"loop": true
			},
			"hit": 8
		}
	},
	"ogre": {
		"x": 16,
		"y": 320,
		"width": 256,
		"height": 32,
		"sliceX": 8,
		"anims": {
			"idle": {
				"from": 0,
				"to": 3,
				"speed": 3,
				"loop": true
			},
			"run": {
				"from": 4,
				"to": 7,
				"speed": 10,
				"loop": true
			}
		}
	},
	"floor": {
		"x": 16,
		"y": 64,
		"width": 48,
		"height": 48,
		"sliceX": 3,
		"sliceY": 3
	},
	"chest": {
		"x": 304,
		"y": 304,
		"width": 48,
		"height": 16,
		"sliceX": 3,
		"anims": {
			"open": {
				"from": 0,
				"to": 2,
				"speed": 20,
				"loop": false
			},
			"close": {
				"from": 2,
				"to": 0,
				"speed": 20,
				"loop": false
			}
		}
	},
	"sword": {
		"x": 322,
		"y": 81,
		"width": 12,
		"height": 30
	},
	"wall": {
		"x": 16,
		"y": 16,
		"width": 16,
		"height": 16
	},
	"wall_top": {
		"x": 16,
		"y": 0,
		"width": 16,
		"height": 16
	},
	"wall_left": {
		"x": 16,
		"y": 128,
		"width": 16,
		"height": 16
	},
	"wall_right": {
		"x": 0,
		"y": 128,
		"width": 16,
		"height": 16
	},
	"wall_topleft": {
		"x": 32,
		"y": 128,
		"width": 16,
		"height": 16
	},
	"wall_topright": {
		"x": 48,
		"y": 128,
		"width": 16,
		"height": 16
	},
	"wall_botleft": {
		"x": 32,
		"y": 144,
		"width": 16,
		"height": 16
	},
	"wall_botright": {
		"x": 48,
		"y": 144,
		"width": 16,
		"height": 16
	},
})
```

In the code above, we make use of Kaboom's `loadSpriteAtlas()` function to import the sprite atlas image. We pick a name for each sprite in we pick in the atlas and specify its location with the `x` and `y` attributes we allocate it. We also specify the size dimensions of each sprite's `width` and `height`. The `anims` attribute is for the animated behaviors of the sprite, such as how it moves when it runs or walks, the speed it moves at.

Here we have chosen 12 sprites from the sprite atlas which we will be using in this tutorial.

We're going to create an object for 3 main sprites. The player sprite we will be using, the players sword and a ogre our player can interact with. Add the following code below the `loadSpriteAtlas()` function:

```javascript
const player = add([
	pos(map.getPos(2, 2)),
	sprite("hero", { anim: "idle" }),
	area({ width: 12, height: 12, offset: vec2(0, 6) }),
	solid(),
	origin("center"),
])

const ogre = add([
	sprite("ogre"),
	pos(map.getPos(4, 4)),
	origin("bot"),
	area({ scale: 0.5 }),
	solid(),
])

const sword = add([
	pos(),
	sprite("sword"),
	origin("bot"),
	rotate(0),
	follow(player, vec2(-4, 9)),
	spin(),
])
```

In the code above, the line `pos(map.getPos())` will place our sprites on a particular position of the game map - which we are still going to implement. `sprite("hero", { anim: "idle" })` assigns the "hero" sprite to our player and initially makes their movements idle. With the `area()` component, we give our player the area component which will let them use certain component functions in the game.

With the "sword" object, we use the function `follow()` to let it follow our player everywhere he goes, making it seem as though he is carrying the sword. The `spin()` function, will make the sword rotate each time the player uses it. Add the following code to add its implementation:

```javascript

function spin() {
	let spinning = false
	return {
		id: "spin",
		update() {
			if (spinning) {
				this.angle += 1200 * dt()
				if (this.angle >= 360) {
					this.angle = 0
					spinning = false
				}
			}
		},
		spin() {
			spinning = true
		},
	}
}

```

This function will check if the sword is spinning, if not it will rotate the sword at 360  degrees in place when the function is called.

## Game Map

We're going to create a floor level or 2D platform on which our main objects will be placed. We will use the "floor" sprite from the atlas to create a nicely styled floor. Add the following code below the `spin()` function.

```javascript

addLevel([
	"xxxxxxxxxx",
	"          ",
	"          ",
	"          ",
	"          ",
	"          ",
	"          ",
	"          ",
	"          ",
	"          ",
], {
	width: 16,
	height: 16,
	" ": () => [
		sprite("floor", { frame: ~~rand(0, 8) }),
	],
})

```

Let's add a map, which we can use to create the layout for all the sprites in our game. Add the following code below the `addLevel()` function:


```javascript

const map = addLevel([
	"tttttttttt",
	"cwwwwwwwwd",
	"l        r",
	"l        r",
	"l        r",
	"l      $ r",
	"l        r",
	"l $      r",
	"attttttttb",
	"wwwwwwwwww",
], {
	width: 16,
	height: 16,
	"$": () => [
		sprite("chest"),
		area(),
		solid(),
		{ opened: false, },
		"chest",
	],
	"a": () => [
		sprite("wall_botleft"),
		area({ width: 4 }),
		solid(),
	],
	"b": () => [
		sprite("wall_botright"),
		area({ width: 4, offset: vec2(12, 0) }),
		solid(),
	],
	"c": () => [
		sprite("wall_topleft"),
		area(),
		solid(),
	],
	"d": () => [
		sprite("wall_topright"),
		area(),
		solid(),
	],
	"w": () => [
		sprite("wall"),
		area(),
		solid(),
	],
	"t": () => [
		sprite("wall_top"),
		area({ height: 4, offset: vec2(0, 12) }),
		solid(),
	],
	"l": () => [
		sprite("wall_left"),
		area({ width: 4, }),
		solid(),
	],
	"r": () => [
		sprite("wall_right"),
		area({ width: 4, offset: vec2(12, 0) }),
		solid(),
	],
})
```

The "map" object above, uses symbols or letters as keys for positioning specific sprites at different locations on the screen. Each symbol represents a sprite. In the map, we've added a boundary around the "floor" sprite using wall sprites from the sprite atlas.



## Movement and Events

We are going to use the keyboard arrow keys for the player sprites movement. We'll start by creating a variable to hold the player's speed when he moves around, and also a dictionary for the directions he can move.

Add the following code below the "map" object:

```javascript
const SPEED = 120

const dirs = {
	"left": LEFT,
	"right": RIGHT,
	"up": UP,
	"down": DOWN,
}
```
For the left and right movement of our player, we want to make sure that our player's sprite flips in to face the direction in which they are heading. We can use the `flipX()` function for this, which takes a boolean value, and in its negative state, our sprite will be facing its default right direction.

Add the following code, for this implementation:

```javascript
onKeyDown("right", () => {
	player.flipX(false)
	sword.flipX(false)
	player.move(SPEED, 0)
})

onKeyDown("left", () => {
	player.flipX(true)
	sword.flipX(true)
	player.move(-SPEED, 0)
})
```
Let's also add the code for the up and down arrow keys:

```javascript
onKeyDown("up", () => {
	player.move(0, -SPEED)
})

onKeyDown("down", () => {
	player.move(0, SPEED)
})
```
When the direction keys are pressed we want our player sprite to run, and we've added this animation in when loading the "hero" sprite which is our players sprite.
When the keys are released we want our player to remain idle, add the  code below to implemwntthis behaviour:

```javascript
onKeyPress(["left", "right", "up", "down"], () => {
	player.play("run")
})

onKeyRelease(["left", "right", "up", "down"], () => {
	if (
		!isKeyDown("left")
		&& !isKeyDown("right")
		&& !isKeyDown("up")
		&& !isKeyDown("down")
	) {
		player.play("idle")
	}
})
```
The code above will check if the directional keys are pressed or released.

To follow the player as he walks, we're going to use the `camPos()` function. This will make the camera follow our players movements in any direction. Add the following code below the previous `onKeyRelease()` function:

```javascript
player.onUpdate(() => {
	camPos(player.pos)
})
```

In the game map, there's an "$" symbol that presents a chest sprite. Let's animate this chest to make it open when the player sprite uses the space key next to it. Add the following code below the `onUpdate()` function.

```javascript
onKeyPress("space", () => {
	let interacted = false
	every("chest", (c) => {
		if (player.isTouching(c)) {
			if (c.opened) {
				c.play("close")
				c.opened = false
			} else {
				c.play("open")
				c.opened = true
			}
			interacted = true
		}
	})
	if (!interacted) {
		sword.spin()
	}
})

```
In the code above, whenever the "space" key is pressed, the program will use check if the player has interacted with the chest or not, if it has the chest will open otherwise the player's sword will spin.

If you run the program now, you can try out the functionality we've implemented and move around the map to see the sprites' animated movements and the layout of the map. All these game objects we've created in the program are from one single sprite atlas image. This is an effective way of storing sprites, especially if it's themed.

## Challenges to try:

* Use sprites from a sprite atlas image to merge different sprites
* Create different game levels or maps from the sprites in the same atlas.

Try out the embedded repl:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/spriteAtlas-1?embed=true"></iframe>
