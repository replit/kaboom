# Add levels in Kaboom

In this tutorial, we will demonstrate how to add levels to our Kaboom games on Replit. We will only create one level for our sprite to run on. We will also add features allowing our player to jump over an obstacle and collect the coins on our level. 

Kaboom allows us to define levels by drawing the layout of our level using only text. Each letter or symbol in this text can be mapped to a character in the game.


## Steps to follow

The steps in this tutorial are as follows:
* Adding level layout
* Handling sprite movement
* Enabling collision detection

You can find the code for this tutorial at https://replit.com/@ritza/add-level or see the embedded code at the bottom of this tutorial.


## Getting started with the code

The first thing we want to do is load the `kaboom()` library and initialize a kaboom context as our first line of code:

```javascript
import kaboom from "kaboom"

kaboom()
  ```

Next, we want to load the sprites and sounds to use. We're using the bean, coin, spike, grass, and ghosty sprites, and the "score" sound to be played each time a coin is collected by the player. 
  
```javascript
loadSprite("bean", "/sprites/bean.png")
loadSprite("coin", "/sprites/coin.png")
loadSprite("spike", "/sprites/spike.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSound("score", "/sounds/score.mp3")
```

Add the speed at which the sprite runs and the gravity acceleration of the sprite. 

```javascript
const SPEED = 480

gravity(2400)
```


## Adding level layout 

The first part of our code for adding a level layout is designing the level layout using symbols with the following code:

```javascript
const level = addLevel([
	"@  ^ $$",
	"=======",
], {
  ```

Each symbol we use can be mapped to a character. In our code, our chacaters will be our bean sprite, the spike, grass and the two coins.

Next, we want to add the size of each grass block in our level and to define the position of the top left block. 

  ```javascript

	width: 64,
	height: 64,

	pos: vec2(100, 200),
  ```

For each symbol, we will map it to its corresponding character and also add the different components to determine how the sprite would function. These components include: the `area()`, which will enable collision detection; `body()`, which gives the sprite ability to respond to gravity, `origin()`, for the position, and `solid()` so that other objects cannot move past it. 

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

When a player clicks the `space` button on the keyboard we want the sprite to jump:

```javascript
const player = get("player")[0]

onKeyPress("space", () => {
	if (player.isGrounded()) {
		player.jump()
	}
})
```

When a player clicks the `left` and `right` arrow keys we want the bean sprite to run in the relevant direction:
 
```javascript

onKeyDown("left", () => {
	player.move(-SPEED, 0)
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
})
```

## Enabling collision detection: spike

When colliding with a spike ("danger"), we want the bean sprite to jump back to the original position:

```javascript
player.onCollide("danger", () => {
	player.pos = level.getPos(0, 0)
})
```


## Enabling collision detection: collecting coins

When a coin is collected, we want it to disappear and add the score updated accordingly:

```javascript
player.onCollide("coin", (coin) => {
	destroy(coin)
	play("score")
})
```


# Things to try

You can add functionality to keep track of the score each time a coin is collected. Visit https://kaboomjs.com/ to learn more.

Check out the repl in the link below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/add-level?embed=true"></iframe>
