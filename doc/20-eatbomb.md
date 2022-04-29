# Eating bombs in Kaboom

In this tutorial, we'll create a minigame called "Eatbomb" to learn how we can consume other sprites in a game.

In our game, the player has to dodge all incoming "fruit" sprites and consume only "bomb" sprites to gain points. The player loses if any "bomb" sprites are left uneaten.

![eat-bombs](eatbombs.png)

You can find the code for this tutorial [on our repl](https://replit.com/@ritza/eatbomb), or in the embedded repl at the end of this tutorial.

## Getting started 

Let's start by adding the following code to our project to initiate a Kaboom context:

```javascript
kaboom({
background : [25,25,26]
})
```

This gives our context a dark grey background. 

Let's import the sprites and sounds we will use in the tutorial. The list `fruits` allows us to load different "fruit" sprites to our game. Add the following code below `kaboom()`:

```javascript
loadSprite("bean", "/sprites/bean.png")
loadSprite("bomb", "/sprites/bomb.png")
loadSound("hit", "/sounds/hit.mp3")
loadSound("wooosh", "/sounds/wooosh.mp3")

const fruits = [
	"apple",
	"pineapple",
	"grape",
	"watermelon",
]

for (const fruit of fruits) {
	loadSprite(fruit, `sprites/${fruit}.png`)
}
```


## Adding the start scene

In this section, we'll implement the scene that will be displayed when we start the game.

```javascript
scene("start", () => {
	play("wooosh")
	add([
		text("Eat All"),
		pos(center().sub(0, 100)),
		scale(2),
		origin("center"),
	])

	add([
		sprite("bomb"),
		pos(center().add(0, 100)),
		scale(2),
		origin("center"),
	])

	wait(1.5, () => go("game"))

})
```

In the code above, we use the "wooosh" sound to show that the game has started. We add the text "Eat All" along with the "bomb" sprites at the center of the screen to show players which sprites to consume in the game.

Using the `wait()` function, we let the program wait 1.5 seconds while displaying this start scene before it goes to the game scene and lets us start playing.

## Adding the main game scene

Games usually run in a loop, and all components are updated with each iteration of the loop to show any changes to their state.

The code in this section will all be written in the game's main scene.

Let's add a few constants for the movement of the sprites in the game. Add the following code below the `for  loop()`:

```javascript
scene("game", () => {

	const SPEED_MIN = 120
	const SPEED_MAX = 540
```

We'll place most of the code for the main game loop in the `scene()` function.

Now add the following code below the speed variables to create an object that will hold the sprite of our player:

```javascript

	const player = add([
		sprite("bean"),
		pos(40, 20),
		area({ scale: 0.5 }),
		origin("center"),
	])
```

The `scale()` function increases the size of the sprite. We use `pos()` and `origin()` to set the player's starting position when the game starts.

Let's add the function `scoreLabel()` below the player object to count the score:

```javascript
	let score = 0

	const scoreLabel = add([
		text(score, 32),
		pos(12, 12),
	])
```

To make our player move according to the mouse position on the game screen, add the following code below `scoreLabel()`:

```javascript
	player.onUpdate(() => {
		player.pos = mousePos()
	})
```

Now that we've implemented our player's movement, let's add food to the game screen. We have to make sure our player can only eat the "bomb" sprites and if they eat any other sprite they lose the game.

Add the following code below the previous `onUpdate()` function:

```javascript

	player.onCollide("bomb", (bomb) => {
		addKaboom(player.pos)
		score += 1
		destroy(bomb)
		scoreLabel.text = score
		burp()
		shake(12)
	})
 
player.onCollide("fruit", (fruit) => {
		go("lose", score)
		play("hit")
	})

```

In the code above, we implement what happens when the player collides with a sprite. The `addKaboom()` function adds the kaboom icon when the player collides with a bomb, and the `score` variable will increment the score by one. We use `destroy()` to remove the sprite from the game screen, since the player has eaten it. We use `burp()` to play the burp sound, and `shake()` to add a cool shake effect to the player sprite.

If the player collides with a "fruit" sprite, we use `go()` to end the "main" scene and show the "lose" scene, which we'll implement shortly.

Add the following code below `onCollide()` to continue adding fruit and bomb sprites that move towards the left edge of the screen:

```javascript

  	onUpdate("bomb", (bomb) => {
		if (bomb.pos.x <= 0) {
			go("lose", score)
			play("hit")
			addKaboom(bomb.pos)
		}
	})
  
	onUpdate("food", (food) => {
		food.move(-food.speed, 0)
		if (food.pos.x < -120) {
			destroy(food)
		}
	})

```

Here we update the game so that when "fruit" sprites reach the edge of the game screen they are destroyed, but if a "bomb" sprite reaches the edge, the player loses the game.

Let's create a loop function to spawn "fruit" sprites for as long as the "main" scene is still active:

```javascript
loop(0.3, () => {

		const x = width() + 24
		const y = rand(0, height())
		const speed = rand(SPEED_MIN, SPEED_MAX)
		const isBomb = chance(0.5)
		const spriteName = isBomb ? "bomb" : choose(fruits)

		add([
			sprite(spriteName),
			pos(x, y),
			area({ scale: 0.5 }),
			origin("center"),
			"food",
			isBomb ? "bomb" : "fruit",
			{ speed: speed }
		])

	})

})
```

Inside the `loop()` function, we create constants `x` and `y` to spawn new fruits at random `y` (horizontal) positions on the right edge of the screen. We set the speed the fruits will move at to a random value between the minimum and maximum speed variables we created earlier.

The `spriteName` variable will check whether the current sprite is a "bomb" sprite or "fruit" sprite.

## Adding the lose scene

The lose scene will only be active when a player collides with a "fruit" sprite or one of the "bomb" sprites reaches the left edge of the game screen. We'll place the code in this section in the "lose" scene function.

Once the player loses, the player sprite and the player's score will be displayed on the screen. Add the following code below the closing bracket of the "main" scene:

```javascript
scene("lose", (score) => {

	add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 108),
		scale(3),
		origin("center"),
	])

	
	add([
		text(score),
		pos(width() / 2, height() / 2 + 108),
		scale(3),
		origin("center"),
	])
```

Here we specify that the player sprite and the score are displayed in the center of the game screen.

Once the player has lost, we need to go back to the starting scene so that they can press any key or the space bar to restart the game. Add the following code:

```javascript
	onKeyPress("space", () => go("start"))
	onClick(() => go("start"))

})
```

Outside the "lose" scene function, add the following code:

```javascript
go("start")

```

This will display the "start" scene before the game starts.

### Things to try:

* Try making a Pac-Man-type game where enemy sprites chase the player until they consume food, at which point the player has few seconds to consume the enemy sprites.

Try out the embedded repl below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/eatbomb?embed=true"></iframe>
