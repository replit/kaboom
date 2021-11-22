# Role-playing game with Kaboom

Role-playing games are ones where a player advances through various quests and improves their abilities or advances to another level of the game. RPG games are fun because the character-building process is a cause for intrigue. As the character advances, the game itself may become more interesting and challenging.

In this tutorial we'll create an RPG game in which a character has to collect a key to unlock a door in a room they're trapped in and by unlocking this door the character can advance to another level.

# Steps to follow

We're going to learn how to add the following:

- Game objects - Loading the necessary characters
- The main scene - Adding game levels and positioning our characters and game events
- Player movement - Setting up control keys
- Collisions - Events for when our character collides with other characters in the game
- Winning scene - Events for when the player completes all levels and wins

You can find the code we use at https://replit.com/@ritza/rpg-tutorial or you can try out the embedded repl below.

![RPG](https://raw.githubusercontent.com/ritza-co/kaboom/kaboom-concept-tutorials/assets/screenshots/rpg.png)

# Getting started with the code

The first thing we want to do is load the kaboom() library and initialize a Kaboom context.

```
import kaboom from "kaboom";

kaboom()
```

Next, we want to load the sprites we'll be using. The game will have various objects.

```
loadSprite("bag", "/sprites/bag.png")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("steel", "/sprites/steel.png")
loadSprite("door", "/sprites/door.png")
loadSprite("key", "/sprites/key.png")
loadSprite("bean", "/sprites/bean.png")
```

## The main scene

This is the main game loop. Here we'll set up the game levels and the character objects and their behaviors. The game has two levels and two other characters besides our player, whom our player can interact with, each placed in one level.

Firstly we'll create the characters and their dialogs:

```
scene("main", (levelIdx) => {

    const SPEED = 320

    const characters = {
        "a": {
            sprite: "bag",
            msg: "ohhi how are you?",
        },
        "b": {
            sprite: "ghosty",
            msg: "get out!",
        },
    }
```

### Levels
Now we have to create the different layouts for the levels of the game. We store these levels in an array and for each of the levels we create, we will set up the positions for some of the sprites we loaded above. We will use symbols to represent the sprites in the array.

```
    // level layouts
    const levels = [
        [
            "=====|===",
            "=       =",
            "= a     =",
            "=       =",
            "=       =",
            "=    $  =",
            "=       =",
            "=   @   =",
            "=========",
        ],
        [
            "---------",
            "-       -",
            "-       -",
            "-  $    -",
            "|       -",
            "-       -",
            "-     b -",
            "-   @   -",
            "---------",
        ],
    ]
```

### Symbols

Each of the symbols represents a specific sprite as shown below. Each symbol is an object with a sprite and its own components.

```
addLevel(levels[levelIdx], {
	width: 64,
	height: 64,
	pos: vec2(64, 64),
	"=": () => [
		sprite("grass"),
		area(),
		solid(),
	],
	"-": () => [
		sprite("steel"),
		area(),
		solid(),
	],
	"$": () => [
		sprite("key"),
		area(),
		"key",
	],
	"@": () => [
		sprite("bean"),
		area(),
		solid(),
		"player",
	],
	"|": () => [
		sprite("door"),
		area(),
		solid(),
		"door",
	],
```

Next, we'll add a special function called `any()` to the above array. `any()` gets called everytime there's a symbol not defined above and is supposed to return what that symbol means.

```
any(ch) {
	const char = characters[ch]
	if (char) {
		return [
			sprite(char.sprite),
			area(),
			solid(),
			"character",
			{ msg: char.msg, },
		]
	}
},
```

## Colllisions

When our player character collides with the other characters in the game, a dialog will ensue. If it's the door, we can check whether they have obtained the key and then let them advance to the next level. If our player has no key, they won't be able to advance.

Here we'll create a function to add dialogs to the screen. These dialogs can be displayed, hidden, or destroyed depending on our player character's actions.

```
function addDialog() {
	const h = 160
	const pad = 16
	const bg = add([
		pos(0, height() - h),
		rect(width(), h),
		color(0, 0, 0),
		z(100),
	])
	const txt = add([
		text("", {
			width: width(),
		}),
		pos(0 + pad, height() - h + pad),
		z(100),
	])
	bg.hidden = true
	txt.hidden = true
	return {
		say(t) {
			txt.text = t
			bg.hidden = false
			txt.hidden = false
		},
		dismiss() {
			if (!this.active()) {
				return
			}
			txt.text = ""
			bg.hidden = true
			txt.hidden = true
		},
		active() {
			return !bg.hidden
		},
		destroy() {
			bg.destroy()
			txt.destroy()
		},
	}
}
```

We can add a boolean variable to check when our player collides with the key character. If so, the key will disappear from the screen as our player 'obtains' it.

```
let hasKey = false
const dialog = addDialog()

player.onCollide("key", (key) => {
	destroy(key)
	hasKey = true
})
```

If our player collides with the door and has obtained the key, we can check if they haven't finished all levels in the game and still need to advance, or if they have, in which case they win the game. However, if our character collides with the door and has no key, they won't advance and a dialog message will be displayed to inform them.

```
player.onCollide("door", () => {
	if (hasKey) {
		if (levelIdx + 1 < levels.length) {
			go("main", levelIdx + 1)
		} else {
			go("win")
		}
	} else {
		dialog.say("you got no key!")
	}
})

player.onCollide("character", (ch) => {
	dialog.say(ch.msg)
})
```

When our player collides with the barrier sprites, they won't be able to pass through as they contain a `solid()` component. Our player also can't pass through the other characters in the game except for the key character.

## Player movement

This is the last part of the main scene. Here we create a dictionary of direction keys used to control our player's movements.

```
const dirs = {
	"left": LEFT,
	"right": RIGHT,
	"up": UP,
	"down": DOWN,
}
```

We also dismiss dialogs if our player has collided with other sprites and they move away.

```
for (const dir in dirs) {
	onKeyPress(dir, () => {
		dialog.dismiss()
	})
	onKeyDown(dir, () => {
		player.move(dirs[dir].scale(SPEED))
	})
}
```

## Winning scene

Lastly, we'll define the winning scene so that when our player finishes both levels in the game, it shows that we won!

```
scene("win", () => {
    add([
        text("You Win!"),
        pos(width() / 2, height() / 2),
        origin("center"),
    ])
})
```

# Things to try

You can follow https://kaboomjs.com/ to learn more about the Kaboom library.

Here's a suggestion to enhance the game:

- Try to add some background music for the duration of the game

You can try out the code in the embedded repl below:

<iframe height="400px" width="100%" src="https://replit.com/@ritza/rpg-tutorial?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
