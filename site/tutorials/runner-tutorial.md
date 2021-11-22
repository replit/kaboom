# Runner with Kaboom

Runner is a speed game in which a player character runs on a surface jumping over trees. The longer he lasts in the game, the higher his score. It is much similar to Google's [Dinosaur game](https://elgoog.im/t-rex/).

In this tutorial, we're going to learn how to create our own runner game with Kaboom.

You can find the code we use at https://replit.com/@ritza/runner-tutorial or you can try out the code in the embedded repl below.

## Steps to follow

We're going to cover how to add the following:

- Game objects and variables - Adding variables(e.g game speed), player characters, the floor surface
- The main events -  Adding trees, scores, player movement, and collisions in the main scene
- The losing scene - Events for when our player loses the game

![Runner](https://raw.githubusercontent.com/ritza-co/kaboom/kaboom-concept-tutorials/assets/screenshots/runner.png)

## Getting started with the code

The first thing we want to do is load the `kaboom()` library and initialize a Kaboom context. 

```
import kaboom from "kaboom";

kaboom()
```

Next, we want to load our player sprite.

```
loadSprite("bean", "/sprites/bean.png")
```

## Game objects and variables

Before getting started with the main scene, the main game loop, we have to declare some constant variables. These variables include the height of the floor our player runs on, our player's jump force as well as the game speed.

```
const FLOOR_HEIGHT = 48
const JUMP_FORCE = 800
const SPEED = 480
```

We can experiment by altering these values but for now, we'll keep them constant. Inside the main scene, we can set a value for the gravity in the game so that our player can stay grounded to the floor when running.

```
gravity(2400)
```

Next, we'll add a player character, giving it an initial position on the game screen and also giving it `area()` and `body()` components to handle collisions and gravity.

```
const player = add([
	sprite("bean"),
	pos(80, 40),
	area(),
	body(),
])
```

Here we'll add the floor, positioned at the bottom of the game screen.

```
add([
	rect(width(), FLOOR_HEIGHT),
	outline(4),
	pos(0, height()),
	origin("botleft"),
	area(),
	solid(),
	color(127, 200, 255),
])
```

## The main events

Now we're going to create the main events of the game.

Firstly, we need a function to create trees. We're passing this function `spawnTree()` inside `wait()` to ensure that it creates a new tree at random intervals during the game.

```
function spawnTree() {

	add([
		rect(48, rand(32, 96)),
		area(),
		outline(4),
		pos(width(), height() - FLOOR_HEIGHT),
		origin("botleft"),
		color(255, 180, 255),
		move(LEFT, SPEED),
		cleanup(),
		"tree",
	])

	wait(rand(0.5, 1.5), spawnTree)

}
spawnTree()
```

Now we're going to create a jump function that will check whether our player is grounded to the floor. If so, it allows them to jump when the space button is pressed or when user clicks.


```
function jump() {
	if (player.isGrounded()) {
		player.jump(JUMP_FORCE)
	}
}

onKeyPress("space", jump)
onClick(jump)

```

If our player collides with any of the trees, we will lose the game. We can add some fun sound effects using `burp()` during collisions.

```
player.onCollide("tree", () => {
	go("lose", score)
	burp()
	addKaboom(player.pos)
})
```

The score in the game increases per frame, so the longer our character lasts in the game, the higher our score will be. The score will be displayed at the top left of our game screen and updated with each frame.

```
let score = 0

const scoreLabel = add([
	text(score),
	pos(24, 24),
])

onUpdate(() => {
	score++
	scoreLabel.text = score
})
```

Our player loses the game when colliding with the screen. When this happens, our score will be displayed at the center of the screen along with our character.

```
add([
	sprite("bean"),
	pos(width() / 2, height() / 2 - 80),
	scale(2),
	origin("center"),
])

add([
	text(score),
	pos(width() / 2, height() / 2 + 80),
	scale(2),
	origin("center"),
])
```

At the end of a game, we can restart the game when the space button is pressed or when user clicks.

```
onKeyPress("space", () => go("game"))
onClick(() => go("game"))
```

# Things to try

Play around with changing the screen background to use something else other than the default checkerboard pattern. You can follow https://kaboomjs.com/ to learn more about the Kaboom library. 

You can try out the code in the embedded repl below:

<iframe height="400px" width="100%" src="https://replit.com/@ritza/runner-tutorial?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
