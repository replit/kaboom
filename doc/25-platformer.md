# Platformer games with Kaboom

Platform games involve the player moving their game character between points in a rendered environment. These games require players to run, jump, and climb in the rendered environment to navigate it and reach their goal.

In this tutorial, we'll create a multi-level platform game in which a player navigates the game environment to collect food and coins for points.

## Steps to follow

We'll cover how to do the following:

- Load game objects
- Create the main scene
- Handle player sprite's movement
- Handle collisions
- Create the winning and losing scene

![platformer](platformer.png)

The code for this tutorial can be found on [our repl](https://replit.com/@ritza/platformer) or you can try out the embedded repl below.

## Getting started

Add the following code to your project to initialize a Kaboom context:

```javascript
import kaboom from "kaboom"

kaboom()
```

### Loading game objects
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

Let's declare some constant values for the jumping force and moving speed of our game objects. We us `FALL_DEATH` to define the speed at which the player sprite falls off the platform to their death. Add the following code below the imported assets:

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

Another component function we will need is one that makes objects grow big. The `big()` function makes objects big if they are small, and vice versa.
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

In this section, we'll create a map for the layout of the different levels of the game. Our game will consist of two levels, which we will store in an array. Each level in the array consists of different symbols, and each symbol represents the position of a specific game object.

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

Next, we want to map the different symbols to their corresponding game object. Add the following code below the `LEVELS` array:

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

We've assigned a sprite to each symbol in the level maps.  Each symbol is given a tag, or name. The components `area()` and `body()` give the sprite objects a physical body that can react to collisions with other objects and is subject to the game's gravity. The `solid()` component makes sure that no other game objects can pass through an object with this component.

## Creating the main scene

The main scene of the game is the game environment that will be active as long as the player has not yet won or lost the game. This is where most of the behavior occurs.

All the code in this section will be placed inside the `scene()` function with the tag `"game"`. Add the following code below the `levelConf` map:

```javascript
scene("game", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {

	gravity(3200)
  
	const level = addLevel(LEVELS[levelId ?? 0],levelConf)
```

In the code above, we pass `"game"` as the name of the scene, the `levelId` of the current game level id, and `coins` the player has collected. Initially, these values will be 0.

The `gravity()` function describes the amount of gravity in the game. The `level` variable will hold the ID of the current game level and its map.

Next, we'll add a player object for the `"bean"` sprite. Add the following code below the `level` variable:

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
 
The player sprite is given the `big()` component we defined earlier in the tutorial. The `scale()` function determines the size of the player sprite relative to the game screen.

Add the next block of code below the `player` object:

 ```javascript
	player.onUpdate(() => {
		camPos(player.pos)
		if (player.pos.y >= FALL_DEATH) {
			go("lose")
		}
	})

```

The `onUpdate()` function will update the state of the player's position in every frame. The `camPos()` function will make the game screen or "camera" follow the player's movement as the game progresses.

The if statement in the update function will check if the player sprite falls from a platform and dies, in which case it will switch to the losing scene which we are yet to implement. 

## Handling player movement

We'll use the keyboard arrow keys to control our sprite's movements, and the space key to make it jump. Add the following code below the `onUpdate()` function to implement the control keys:

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

The `onKeyDown()` and `onKeyPress()` functions allow the program to register which of the keyboard keys we specify are pressed. The `isGrounded()` and `jump()` functions are provided by the `body()` component. We use `isGrounded()` to check if the sprite is standing on a platform or solid object to enable them to jump.

The "f" key will make use of the `fullscreen()` function to switch our game screen to fullscreen when pressed. This is where the `"game"` scene ends.

## Handling collisions

Our sprite will collide with other objects in the game, such as food, coins, spikes, portals, and even enemies. We need to add the behavior that will occur if these collisions happen.

Add the following code below the last `onKeyPress()` function outside of the `"game"` scene function:

```javascript
	player.onCollide("danger", () => {
		go("lose")
		play("hit")
	})
```

If the player's sprite collides with the spike objects, they will lose. These objects have the tag `"danger"`. 

Add the next block code below the `"danger"` collision function:

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

The code above implements what happens when the player's sprite collides with a portal object. If the player reaches a portal, they will go to the next level game scene, which has a different `levelId`. The game also keeps track of the number of coins collected in the previous level. If the player has completed all the levels, they will go to the winning scene instead.

Add the following code below the `"portal"` collision function:

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

The code above registers the collisions between the player sprite and enemy objects. The `onGround()` function checks whether the sprite landed on top of an enemy. If it did, it can jump from on top of the enemy and destroy it.

However, if the player collides with the enemy instead, and it's not from the top, the player will die and the game will switch to the losing scene. The `play()` function plays the specified sound clip each time one of these collisions occurs.

Add the folowing code below the `"enemy"` collision function:

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

The `onHeadButt()` function checks whether the player sprite collides with the prize object from the top, in which case it will spawn an apple if it has not already done so.

If the player sprite collides with the `"apple"` object, it will grow bigger and the apple will be destroyed or "eaten" by the player sprite. The `biggify()` component is the one we defined earlier in the tutorial inside the `big()` component function.

Add the following code below the `"apple"` collision function:

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

The code above implements what happens when a player sprite collides with the objects tagged `"coins"`: the coin object will be destroyed and the player's `coin` count increased.

The `coinPitch` variable will be used to `detune` the pitch of the sound played as the player collects coins.

Add the following code below the `"coin"` collision function to display the coin count text on the game screen:

```javascript
	const coinsLabel = add([
		text(coins),
		pos(24, 24),
		fixed(),
	])
```

This will be displayed on the top-left corner of the screen.

## Creating the winning and losing scene

In this section, we will implement the `"win"` and `"lose"` game scenes for when a player wins or loses the game.

Add the following code below the `coinsLabel` object:

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

The `text()` function will be used to render a message on the screen to let the player know if they have won or lost the game. In either case, if the player presses any key on the keyboard, the game will switch to the initial `"game"` scene, and the player will be able to restart the game.


Add this line of code below the `"win"` scene to initiate the game with the `"game"` scene when the program starts:

```javascript
go("game")

```

The `go()` function is the one that will go to the scene with the name passed in.

That's it for our platformer game!

## Things to try

Here are some ideas to try out to make the game more entertaining:

- Add background music to play as the game progresses.
- Give the player temporary flying abilities when they eat an apple.

Try out the embedded repl below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/platformer?embed=true"></iframe>
