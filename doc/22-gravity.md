# Creating a gravity effect with Kaboom

In this tutorial, we're going to learn how to create the gravity effect for game objects. You can find the code we use [on our repl](https://replit.com/@ritza/gravity) or in the embedded code at the end of this tutorial.

# Getting started with the code

The first thing we want to do is load the `kaboom()` library and initialize a Kaboom context:

```js
import kaboom from "kaboom";

kaboom();
```

Next we'll load the assets we'll be using, in this case, our player sprite, Bean.

```js
loadSprite("bean", "/sprites/bean.png")
```

## The gravity function

The `gravity()` function allows us to pull a game object towards the bottom of the game screen. When we give game objects the `body()` component, we're giving them a "physical body" with the ability to react to gravity in the game.

```js
const player = add([
	sprite("bean"),
	pos(center()),
	area(),
	body(),
])
```

We can alter the acceleration of the gravitational pull by passing the number of pixels we want a sprite to move by per second into `gravity()`, for example:

```js
gravity(30)
```

Where 30 is the number of pixels the game object accelerates per second, towards the source of gravity. The higher this value is, the faster a game object will move.

Another fun example would be to simulate the force of gravity which is 9.82m/s<sup>2</sup>.

```js
gravity(9.82**2)
```

Keep in mind, converting the actual value of the force of gravity to pixels would be a fairly large number and 9.82 would be passed as pixels and an object would move way too slowly. Adding the exponent 2 will create a fairly acceptable acceleration rate.

Next we'll add a platform for the player to land on to simulate the ground. The `solid()` component prevents other solid components from passing through a game object.

```js
add([
	rect(width(), 48),
	outline(4),
	area(),
	pos(0, height() - 48),
	solid(),
])
```

The `.onGround()` function is provided by `body()`. It registers an event that runs whenever the player hits the ground. We simply want to output a message via the log:

```js
player.onGround(() => {
	debug.log("ouch")
})
```

We can get the player to jump once it has landed on the ground by pressing the space key:

```js
onKeyPress("space", () => {
	if (player.isGrounded()) {
		player.jump()
	}
})
```

The `jump()` method is also provided by `body()`. Check out https://kaboomjs.com#BodyComp for everything `body()` provides.

# Things to try

* Try to reverse the gravity in the game and make your player gravitate upwards.

Take a look at the repl for this tutorial below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/gravity?embed=true"></iframe>
