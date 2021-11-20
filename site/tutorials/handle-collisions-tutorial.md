# Handling collisions with Kaboom 

Kaboom is a fun library that enables the creation of simple games.

In this tutorial, we're going to look at how to handle sprite collisions on the screen. We want our player to deal with other game objects that are destroyable (removable from the screen) and those that are not. You can find the link to the code at https://replit.com/@ritza/handle-collisions-tutorial or check out the embedded code at the bottom of the tutorial.

## Steps to follow

The steps in this tutorial are as follows:

- Load the game objects or sprites we'll be adding to the screen
- Handle user input to move the player object
- Check for collisions between objects

## Getting started with the code

The first thing we want to do is load the `kaboom()` library and initialize a kaboom context. We can load anything we want as the game window say the typical checkerboard pattern or a solid colored background or anything else we'd like. In this case, we want the default checkerboard pattern.

```
import kaboom from "kaboom";

kaboom();
```

Next, we want to load the sprites we'll be using. You'll recognize some of these objects from other popular games.

```
loadSprite("bean", "/sprites/bean.png")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSprite("grass", "/sprites/grass.png")
```

Next, we want to define the movement speed of the player. As such, we use the SPEED constant to move the player by 320 pixels per frame. This `SPEED` will be used to move the player along the X and Y axes. 

```
// Define player movement speed
const SPEED = 320
```

When adding the player game object, we're using our 'bean' sprite and defining components assembled with the `add()` function to determine how 'bean' will function. In this case, we want to use components that would allow us to determine the player position and properties. For instance, the `area()` component gives the object a collider, which enables collision checking and `solid()` ensures that the object can't move pass other solid objects.

```
// Add player game object
const player = add([
	sprite("bean"),
	pos(80, 40),
	area(),
	solid(),
])
```

Now we want to register user input and handle sprite movement. `onKeyDown()` is used to register this movement. You can visit https://replit.com/@ritza/move-sprite-tutorial to learn more about handling user input and movement.

```
onKeyDown("left", () => {
	player.move(-SPEED, 0)
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
})

onKeyDown("up", () => {
	player.move(0, -SPEED)
})

onKeyDown("down", () => {
	player.move(0, SPEED)
})
```

The code below allows us to add other game objects. In this case, we're adding enemies, represented by ghosts, to appear at random positions on the screen. Given that the `area()` component enables collision detection, we need to ensure that we add this component for any game object whose position we're interested in - either to destroy or move around. Please note that the 'grass' game object also has the `solid()` component, which ensures that our player won't be able to destroy or pass through.

```
// Add enemies
for (let i = 0; i < 3; i++) {

const x = rand(0, width())
const y = rand(0, height())

add([
	sprite("ghosty"),
	pos(x, y),
	area(),
	"enemy",
])
}

add([
	sprite("grass"),
	pos(center()),
	area(),
	solid(),
])
```

`.onCollide()` is provided by the `area()` component. It registers an event that runs when an objects collides with another object with a certain tag. In this case we destroy the enemy when the player hits one. You can check out https://kaboomjs.com#AreaComp for everything `area()` provides.

```
player.onCollide("enemy", (enemy) => {
	destroy(enemy)
})
```

## Things to try

Besides destroying an enemy, what else can the player do upon collision with an enemy? 

Play around with the code to try some new things. You can follow https://kaboomjs.com/ to learn more about the Kaboom library. 

You can try out the code in the embedded repl below:

<iframe height="400px" width="100%" src="https://replit.com/@ritza/handle-collisions-tutorial?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
