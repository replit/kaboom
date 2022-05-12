# Platformer with Kaboom
Platform games are often games where the main objective is to move the player character between points in a rendered environment. These games require players to run, jump and climb in the rendered environment to navigate it and reach their goal.

In this tutorial, we're going to create a multi-level platform game where a player navigates their environment collecting food and coins for points.

## Steps to follow

We're going to cover how to do the following:

- Load game objects
- Create the main scene
- Handle player movement
- Handle collisions
- Create the winning and losing scene

![platformer](platformer.png)

The code for this tutorial can be found on [our repl](https://replit.com/@ritza/platformer) or you can try out the embedded repl below.


## Getting Started
Let's add the following code to our project to initialize a Kaboom context:

```javascript
import kaboom from "kaboom"

kaboom()
```

## Loading game objects
To import all the sprites and sound assets we will need for the game, add the following code below  the `kaboom()` function:

```javascript
loadSprite("bean", "/sprites/bean.png")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSprite("spike", "/sprites/spike.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("prize", "/sprites/jumpy.png")
loadSprite("apple", "/sprites/apple.png")
loadSprite("portal", "/sprites/portal.png")
loadSprite("coin", "/sprites/coin.png")
loadSound("coin", "/sounds/score.mp3")
loadSound("powerup", "/sounds/powerup.mp3")
loadSound("blip", "/sounds/blip.mp3")
loadSound("hit", "/sounds/hit.mp3")
loadSound("portal", "/sounds/portal.mp3")

```

### Creating constant game variables and functions

Let's declare some constant values for the jumping force and moving speed of our game objects. `FALL_DEATH` defines the speed at which the player falls off the platform to its death. Add the following code below the imported assets:

```javascript
const JUMP_FORCE = 1320
const MOVE_SPEED = 480
const FALL_DEATH = 2400
```

One of the component functions we will need for the game is a `patrol()` function for enemies to patrol certain parts of the environment. When the enemy game object collides with another game object, for example a grass block, it'll change its direction to the opposite direction. Add the following code below the variables:

```javascript
function patrol(speed = 60, dir = 1) {
	return {
		id: "patrol",
		require: [ "pos", "area", ],
		add() {
			this.on("collide", (obj, col) => {
				if (col.isLeft() || col.isRight()) {
					dir = -dir
				}
			})
		},
		update() {
			this.move(speed * dir, 0)
		},
	}
}
```

Another component function we will need is one that makes objects grow big. The `big()` function will make objects big if they are small and vice versa.
Add the following code below the `patrol()` function:

```javacript
function big() {
	let timer = 0
	let isBig = false
	let destScale = 1
	return {
		id: "big",
  
		require: [ "scale" ],
		update() {
			if (isBig) {
				timer -= dt()
				if (timer <= 0) {
					this.smallify()
				}
			}
			this.scale = this.scale.lerp(vec2(destScale), dt() * 6)
		},

		isBig() {
			return isBig
		},
		smallify() {
			destScale = 1
			timer = 0
			isBig = false
		},
		biggify(time) {
			destScale = 2
			timer = time
			isBig = true
		},
	}
}
```


### Building platform maps

In this section, we're going to create a map for the layout of the different levels of the game. Our game will consist of two levels, which we will store in an array. Each level in the array consists of different symbols, each of which represents the positions of a specific game object.


Add the following code below the `big()` function:

```javascript
const LEVELS = [
	[
		"                          $",
		"                          $",
		"                          $",
		"                          $",
		"                          $",
		"           $$         =   $",
		"  %      ====         =   $",
		"                      =   $",
		"                      =    ",
		"       ^^      = >    =   @",
		"===========================",
	],
	[
		"     $    $    $    $     $",
		"     $    $    $    $     $",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		" ^^^^>^^^^>^^^^>^^^^>^^^^^@",
		"===========================",
	],
]

```

Next, we want to map the different symbols to their corresponding game object. Add the following code below the "LEVELS" array:

```javascript

const levelConf = {
	width: 64,
	height: 64,
  
	"=": () => [
		sprite("grass"),
		area(),
		solid(),
		origin("bot"),
	],
	"$": () => [
		sprite("coin"),
		area(),
		pos(0, -9),
		origin("bot"),
		"coin",
	],
	"%": () => [
		sprite("prize"),
		area(),
		solid(),
		origin("bot"),
		"prize",
	],
	"^": () => [
		sprite("spike"),
		area(),
		solid(),
		origin("bot"),
		"danger",
	],
	"#": () => [
		sprite("apple"),
		area(),
		origin("bot"),
		body(),
		"apple",
	],
	">": () => [
		sprite("ghosty"),
		area(),
		origin("bot"),
		body(),
		patrol(),
		"enemy",
	],
	"@": () => [
		sprite("portal"),
		area({ scale: 0.5, }),
		origin("bot"),
		pos(0, -12),
		"portal",
	],
}
```

We've assigned a sprite to each symbol in the level maps.  Each symbol is given a tag/name. The components `area()` and `body()`  give the sprite objects a physical body that can react to collisions with other objects and the gravity in the game. The `solid()` component makes sure that no other game objects can pass through the object with this component.

## Creating the main scene
This is the main scene of the game, which is the game environment that will be active as long as the player has not yet won or lost the game. This is where most of the behavior occurs.

All the code in this section will be placed inside the `scene()` function with the tag "game". Add the following code below the "levelConf" map:

```javascript
scene("game", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {

	gravity(3200)
  
	const level = addLevel(LEVELS[levelId ?? 0],levelConf)
```

In the code above, we pass "game" as the name of the scene; the "levelId" of the current game level id and "coins" a player has collected. Initially, these values will be 0.

The `gravity()` function describes the amount of gravity in the game. The `level` variable will hold the ID of the current game level and its map.

Next, we'll add a player object for the "bean" sprite. Add the following code below the `level` variable:

```javascript
 const player = add([
		sprite("bean"),
		pos(0, 0),
		area(),
		scale(1),
		body(),
		big(),
		origin("bot"),
	])

 ```
 
The player is given the `big()` component we defined earlier in the tutorial. The `scale()` function determines the size of the player sprite relative to the game screen.

Add the next block of code below the "player" object:

 ```javascript
	player.onUpdate(() => {
		camPos(player.pos)
		if (player.pos.y >= FALL_DEATH) {
			go("lose")
		}
	})

```

The `onUpdate()` function will update the state of the player's position in every frame. `camPos()` function will make the game screen or "camera" follow the player's movement as the game progresses.

The if statement in the update function will check if the player falls from a platform dies, in which case it will switch to the losing scene which we are yet to implement. 

## Handling player movement

To control our player's movements, we will use the keyboard arrow keys. We will also use the space key to make our player jump. Add the following code below the `onUpdate()` function to implement the control keys:

```javascript

	onKeyPress("space", () => {
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE)
		}
	})

	onKeyDown("left", () => {
		player.move(-MOVE_SPEED, 0)
	})

	onKeyDown("right", () => {
		player.move(MOVE_SPEED, 0)
	})

	onKeyPress("down", () => {
		player.weight = 3
	})

	onKeyRelease("down", () => {
		player.weight = 1
	})

	onKeyPress("f", () => {
		fullscreen(!fullscreen())
	})

})
```

The `onKeyDown()` and `onKeyPress()` functions allow the program to register which of the keyboard keys we specify are pressed. The `isGrounded()` and `jump()` functions are provided by the `body()` component. `isGrounded()` checks if the player is standing on a platform or solid object to enable them to jump.

The "f" key will make use of the `fullscreen()` function to switch our game screen to fullscreen when pressed. This is where the "game" scene ends.

## Handling collisions

Our player will collide with other objects in the game, such as food, coins, spikes, portals, and even enemies. We need to add the behavior that will occur if these collisions happen.

Add the following code below the last `onKeyPress()` function outside of the "game" scene function:

```javascript
	player.onCollide("danger", () => {
		go("lose")
		play("hit")
	})
```

If the player collides with the spike objects, they will lose. These objects have the tag "danger" and if the player collides, they will die. 

Add the next block code below the "danger" collision function:

```javascript
	player.onCollide("portal", () => {
		play("portal")
		if (levelId + 1 < LEVELS.length) {
			go("game", {
				levelId: levelId + 1,
				coins: coins,
			})
		} else {
			go("win")
		}
	})
```

The code above implements what happens when the player collides with a portal object. If the player reaches a portal, they will go to the game scene of the next level, with a different levelId. The game also keeps track of the number of coins they collected in the previous level. If the player has completed all the levels, they will go to the winning scene instead.

Add the following code below the "portal" collision function:

```javascript
	player.onGround((l) => {
		if (l.is("enemy")) {
			player.jump(JUMP_FORCE * 1.5)
			destroy(l)
			addKaboom(player.pos)
			play("powerup")
		}
	})

	player.onCollide("enemy", (e, col) => {
		// if it's not from the top, die
		if (!col.isBottom()) {
			go("lose")
			play("hit")
		}
	})
```

The code above registers the collisions between the player and enemy objects. The `onGround()` function checks whether a player landed on top of an enemy, in which case, the player will be able to jump from on top of them and destroy it.

However, if the player collides with the enemy instead, and it's not from the top, the player will die and the game will switch to the losing scene. The `play()` function plays the specified sound clip each time each of these collisions occurs.

Add the folowing code below the "enemy" collision function:

```javascript
	let hasApple = false
	player.onHeadbutt((obj) => {
		if (obj.is("prize") && !hasApple) {
			const apple = level.spawn("#", obj.gridPos.sub(0, 1))
			apple.jump()
			hasApple = true
			play("blip")
		}
	})

	player.onCollide("apple", (a) => {
		destroy(a)
		player.biggify(3)
		hasApple = false
		play("powerup")
	})
```

The `onHeadButt()` function checks whether the player collides with the prize object from the top, in which case it will spawn an apple if it has not already done so.

If the player collides with the "apple" object, it will grow bigger and the apple will be destroyed or "eaten" by the player. The `biggify()` component is the one we defined earlier in the tutorial inside the `big()` component function.

Add the following code below the "apple" collision function:

```javascript
	let coinPitch = 0

	onUpdate(() => {
		if (coinPitch > 0) {
			coinPitch = Math.max(0, coinPitch - dt() * 100)
		}
	})

	player.onCollide("coin", (c) => {
		destroy(c)
		play("coin", {
			detune: coinPitch,
		})
		coinPitch += 100
		coins += 1
		coinsLabel.text = coins
	})
```

The code above implements what happens when a player collides with the objects tagged "coins": it will be destroyed and the `coin` count increased.

The `coinPitch` variable will be used to "detune" the pitch of the sound played as the player collects coins.

Add the following code below the "coin" collision function to display the coin count text on the game screen:

```javascript
	const coinsLabel = add([
		text(coins),
		pos(24, 24),
		fixed(),
	])
```

This will be displayed on the top-left corner of the screen.

## Creating the winning and losing scene

In this section, we will implement the "win" and "lose" games scenes for when the player loses or wins the game.

Add the following code below the "coinsLabel" object:

```javascript
scene("lose", () => {
	add([
		text("You Lose"),
	])
	onKeyPress(() => go("game"))
})

scene("win", () => {
	add([
		text("You Win"),
	])
	onKeyPress(() => go("game"))
})
```

The `text()` function will be used to render a message on the screen to let the player know if they have won or lost the game. In either case, if the player presses any key on the keyboard, the game will switch to the initial scene which is the "game" scene, and the player will be able to restart the game.


Add this last line of code below the "win" scene to initiate the game with the "game" scene when the program starts.

```javascript
go("game")

```

The `go()` function is the one that will go to the scene with the name passed in.

That's it for the platformer game!

### Things to try

Here are some ideas to try out to make the game more entertaining:

- Add background music to play as the game progresses
- Give the player temporary flying abilities when they eat an apple

Try out the embedded repl below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/platformer?embed=true"></iframe>
