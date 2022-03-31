# Using double jump with Kaboom

In this tutorial, we'll learn how to use the double jump function with our sprite objects.

![double jump](double-jump.png)

The code for this tutorial can be found on [our repl](https://replit.com/@ritza/double-jump) or you can try out the embedded repl below.

## Getting started with the code

Let's begin by initializing a kaboom context with the following code:

```javascript
import kaboom from "kaboom"

kaboom({
  background: [236,230,61]
})
```

The `kaboom()` function creates a nice yellow background for our context. 

Add the following lines of code to load the sprites we'll use for this tutorial:

```javascript
loadSprite("bean", "/sprites/bean.png")
loadSprite("grass", "/sprites/grass.png")
```

## Implementing sprite behaviour

In order to give our game objects the jumping effect, we have to create some gravity in the game. That way, when our sprites move upwards, they are subject to gravity.

We'll also declare a few constant variables for the speed of our sprite object when it moves, the jumping force it needs, and the number of platforms we want to add for the object to land on.

Add the following code:

```javascript

gravity(4000)

const PLAYER_SPEED = 640
const JUMP_FORCE = 1200
const NUM_PLATFORMS = 5

```

Let's create an object for our sprite.

```javascript
const bean = add([
		sprite("bean"),
		area(),
		origin("center"),
		pos(0, 0),
		body({ jumpForce: JUMP_FORCE }),
	])
```

The `area()` function will allow our sprite to react to gravity in the game, and it will register when the sprite lands on a solid object, in this case a platform, without falling through it. The `body()` function allows us to specify the jumping force of our sprite.

Let's use a for loop to generate the platforms for the sprite to land on. Add the following lines of code:

```javascript
	for (let i = 1; i < NUM_PLATFORMS; i++) {
		add([
			sprite("grass"),
			area(),
			pos(rand(0, width()), i * height() / NUM_PLATFORMS),
			solid(),
			origin("center"),
			"platform",
		])
	}
```

We've passed the `NUM_PLATFORMS` constant that we created earlier to the for loop to create the specified number of platforms. Using the `pos()` function, we generate a random position for each platform we create, so they aren't all in one place.

Next, we'll position our sprite so that it's always on top of the first platform when we run the program. Add the following line of code:

```javascript
bean.pos = get("platform")[3].pos.sub(0, 64)
```

The `get()` function retrieves the last platform object we created using the loop and positions our sprite on it.

For our sprite's movement, lets add the following lines of code:

```javascript

	onKeyPress("space", () => {
		bean.doubleJump()
	})

	onKeyDown("left", () => {
		bean.move(-PLAYER_SPEED, 0)
	})

	onKeyDown("right", () => {
		bean.move(PLAYER_SPEED, 0)
	})
```

Using the `onKeyPress()` function, we've programmed the space key on our keyboards to make our sprite jump when it is pressed. We use Kaboom's `doubleJump()` function to make objects perform a double jump.

The left and right arrow keys on the keyboard will register our player's horizontal movement, and we've passed our `PLAYER_SPEED` constant to determine how fast the player can move along the horizontal axis.

If you run the program now, you should be able to test out the double jump by moving up along the different platforms.

### Here are some challenges to try:

* Create a bouncing object.
* Recreate the classic *Bounce* game and add levels for your player to advance to.

You can find the code for this tutorial here:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/double-jump?embed=true"></iframe>
