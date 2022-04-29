# How game scenes work in Kaboom

In this tutorial, we'll create a coin collector game to learn how game scenes work in Kaboom. In our game, our player will advance through to different levels by collecting all the coins at each level.

![scenes](scenes.png)

You can find the code we use here [on our repl](https://replit.com/@ritza/scenes), or in the embedded repl at the end of this tutorial.

## Getting started

Let's begin by initializing a Kaboom context. Add the following code to your project:

```javascript

kaboom({
  background:[215,155,25]
})

```

This code will create a context with a dark yellow background.

Next we'll add the sprites and sounds we need for our game. Add the following code below the `kaboom()` function:

```javascript
loadSprite("bean", "/sprites/bean.png")
loadSprite("coin", "/sprites/coin.png")
loadSprite("spike", "/sprites/spike.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSprite("portal", "/sprites/portal.png")
loadSound("score", "/sounds/score.mp3")
loadSound("portal", "/sounds/portal.mp3")
```

## Setting up the main scene

A scene in Kaboom is a setting for a specific situation or condition. For instance, the "game" scene is the setup of the game displayed while we're still playing. If we lose the game, we can change the setup to a "lose" scene to display our score or that we lost.

Before we create the "game" scene, let's create a few constants for our game. Add the following code below the sprite imports:

```javascript
const SPEED = 480

const LEVELS = [
	[
		"@  ^ $$ >",
		"=========",
	],
	[
		"@   $   >",
		"=   =   =",
	],
]

```

The `SPEED` variable holds the speed of our player sprite, and the `LEVELS` list holds a map for different levels through which the player can advance once all the coins in one level are collected. The symbols in the list represent the game objects to be added at different positions on the map.

Now we're going to implement the "game" scene. Using the `scene()` function, we can create a scene and specify the name of the scene in the first parameter. In the second parameter, we can pass (as a list) the variables or arrays that we'll use in the scene. 

The rest of the code in this section will be implemented inside the `scene()` function. Add the following code below the `LEVELS` list:


```javascript
scene("game", ({ levelIdx, score }) => {

	gravity(2400)
```

In the first line in the code above, we create a scene called "game". The variable `levelIdx` represents the current level of the game, which will be declared later on in the code. The variable `score` is the score counter.

With the `gravity()` function, we've created the gravity effect in the game, and any object with a `body()` component will respond to it.

Earlier we created a map of different levels with symbols representing different sprites. Let's assign the loaded sprites to the different symbols on the map:

```javascript  
	const level = addLevel(LEVELS[levelIdx || 0], {
		width: 64,
		height: 64,
		pos: vec2(100, 200),
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
		">": () => [
			sprite("portal"),
			area(),
			origin("bot"),
			"portal",
		],
	})
```

Using the `sprite()` function, we specify which sprite the symbols are assigned to. The `area()` component gives the sprites a collision area, and `origin()` gives the sprites a point of origin when the game starts.

## Adding the player sprite and making them move

Let's create an object for our player sprite. Add the following code below the `level` array:

```javascript
	const player = get("player")[0]
```

Here we get the sprite with the tag `"player"` – which is the first sprite in the array – and assign it to the variable `player`.

We'll use the `onKeyPress()` functions to allow us to use keyboard keys to move our player. Add the following below the `player` variable:

```javascript
	onKeyPress("space", () => {
		if (player.isGrounded()) {
			player.jump()
		}
	})

	onKeyDown("left", () => {
		player.move(-SPEED, 0)
	})

	onKeyDown("right", () => {
		player.move(SPEED, 0)
	})
```

In the code above, we set the space key to make our player jump. We use `isGrounded()` to check if our player is standing on an object or platform before making them jump. The left and right arrow keys move our player horizontally.

## Handling collisions

There are a few collision events we need to implement.

The first collision is when the player collides with a coin and "collects" it. Add this code below the `onKeyDown()` function:

```javascript
	player.onCollide("coin", (coin) => {
		destroy(coin)
		play("score")
		score++
		scoreLabel.text = score
	})
```

When our player collides with a coin, we use the `destroy()` function to remove the coin from the scene, we play the "score" sound, and we increment the score by one and display it on the game screen.

We've added spikes to our game to create a little challenge for our player – if the player lands on or touches a spike they will die! Add this code:

```javascript
	player.onCollide("danger", () => {
		player.pos = level.getPos(0, 0)
		go("lose")
	})

```

When we added the "spike" sprites, we gave them the tag "danger". When the player collides with a sprite with the "danger" tag, we use the `go()` function to switch to the "lose" scene (which we are yet to implement).

The player can also fall off a platform due to the gravity in the game. If the player falls, the game will be over. Let's add this functionality with the `onUpdate()` function to keep checking the player's `y` position to see if they have fallen off:

```javascript
	player.onUpdate(() => {
		if (player.pos.y >= 480) {
			go("lose")
		}
	})
```

The last collision event we'll add is for when the player reaches the "portal" sprite, in which case they will advance to the next level. Add the following code below the `onUpdate()` function:

```javascript
	player.onCollide("portal", () => {
		play("portal")
		if (levelIdx < LEVELS.length - 1) {

			go("game", {
				levelIdx: levelIdx + 1,
				score: score,
			})
		} else {

			go("win", { score: score, })
		}
	})
```

Here, the line `if (levelIdx < LEVELS.length - 1)` will check which level the player is in, and if there are more levels, it will let the player advance. Else it will switch to the "win" scene to show that the player has won the game.

The following function will add the score as a text on screen. Add the code below to the previous `onCollide()` function:

```javascript
	const scoreLabel = add([
		text(score),
		pos(12)
	])

})

```

## Winning or losing

When the player wins the game, the scene will switch from the "game" scene to the "win" scene and the number of coins collected will be displayed. Add the following code for the "win" scene, making sure it's outside the last bracket of the "game" scene:

```javascript
scene("win", ({ score }) => {

	add([
		text(`You grabbed ${score} coins!!!`, {
			width: width(),
		}),
		pos(12),
	])

	onKeyPress(start)

})

```

Similarly, when a player loses, the scene will switch to the "lose" scene, and the text "You Lose" will be displayed. Add the following code below the "win" scene:

```javascript
scene("lose", () => {

	add([
		text("You Lose"),
		pos(12),
	])
	onKeyPress(start)

})
```

Both the "win" scene and "lose" scene use the "onKeyPress(start)" function to switch to the initial display before the game starts if any key is pressed. The `start()` function switches the display from these scenes to the initial "game" scene.

Let's add the implementation of the `start()` function below the "lose" scene:

```javascript
function start() {
	go("game", {
		levelIdx: 0,
		score: 0,
	})
}

start()
```

This function will also reset the score and level in the game so that the player can restart.

### Things to try:

* Add a celebration scene when the player reaches a portal before switching to the next level or the winning scene. Try making the player dance using animations and a celebration sound.
* Add more levels to the game with an increased number of spikes.

Try the embedded repl below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/scenes?embed=true"></iframe>
