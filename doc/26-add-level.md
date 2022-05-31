# Adding levels in Kaboom

In this tutorial, we will demonstrate how to add levels to Kaboom games on Replit. We'll create one level for our sprite to run on, and add features allowing our sprite to jump over obstacles and collect coins. 

Kaboom allows us to define levels by drawing the layout of our level using only text. Each letter or symbol in this text can be mapped to a character in the game.

## Steps to follow

The steps in this tutorial are as follows:

* Adding level layout
* Handling sprite movement
* Enabling collision detection

You can find the code for this tutorial on [our repl](https://replit.com/@ritza/add-level) or see the embedded code at the end of this tutorial.

## Getting started with the code

Let's load the `kaboom()` library and initialize a Kaboom context as our first line of code:

```javascript
import kaboom from "kaboom"

kaboom()
  ```

Next we'll load the sprites and sounds we'll use. We're using the bean, coin, spike, grass, and ghosty sprites, and the `"score"` sound which will be played each time a coin is collected:
  
```javascript
loadSprite("bean", "/sprites/bean.png")
loadSprite("coin", "/sprites/coin.png")
loadSprite("spike", "/sprites/spike.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSound("score", "/sounds/score.mp3")
```

Add the speed at which the sprite runs and the gravity acceleration of the sprite: 

```javascript
const SPEED = 480

gravity(2400)
```

## Adding level layout 

The first part of our code for adding a level layout is designing the level layout using symbols:

```javascript
const level = addLevel([
	"@  ^ $$",
	"=======",
], {
  ```

Each symbol we use can be mapped to a character. In our code, our chacaters will be our bean sprite, the spike, grass, and the two coins.

Now we'll add the size of each grass block in our level and define the position of the top left block: 

  ```javascript

	width: 64,
	height: 64,

	pos: vec2(100, 200),
  ```

We will map each symbol to its corresponding character and add the different components to determine how the sprite will function. These components include: the `area()`, which will enable collision detection; `body()`, which gives the sprite ability to respond to gravity; `origin()`, for the position; and `solid()`, so that other objects cannot move past it. 

```javascript
	"@": () => [
		sprite("bean"),
		area(),
		body(),
		origin("bot"),
		"player",
	],
	"=": () => [
		sprite("grass"),
		area(),
		solid(),
		origin("bot"),
	],
	"$": () => [
		sprite("coin"),
		area(),
		origin("bot"),
		"coin",
	],
	"^": () => [
		sprite("spike"),
		area(),
		origin("bot"),
		"danger",
	],
})
```


## Handling sprite movement

We'll make the sprite jump when a player hits the spacebar on the keyboard:

```javascript
const player = get("player")[0]

onKeyPress("space", () => {
	if (player.isGrounded()) {
		player.jump()
	}
})
```

When a player presses the left or right arrow key, the bean sprite will run in the corresponding direction:
 
```javascript

onKeyDown("left", () => {
	player.move(-SPEED, 0)
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
})
```

## Enabling collision detection: spike

When the bean sprite collides with a spike (with the tag "danger"), it will jump back to its original position:

```javascript
player.onCollide("danger", () => {
	player.pos = level.getPos(0, 0)
})
```


## Enabling collision detection: collecting coins

When our sprite collides with a coin, the coin is collected. Let's add the code to make the coin disappear and update the score accordingly:

```javascript
player.onCollide("coin", (coin) => {
	destroy(coin)
	play("score")
})
```


# Things to try

You can add functionality to keep track of the score each time a coin is collected.

Check out the repl in the link below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/add-level?embed=true"></iframe>
