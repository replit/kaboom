# Flappy with Kaboom

If you want a game that keeps you on the edge of your seat, flappy is the one for you.

Like the mobile game, Flappy bird, we control our player character as it flies between pipes - similar to a bird flapping its wings - trying not to hit them. 
We gain a point each time our character passes through a pipe.

In this tutorial, we are going to learn how to create our own version of Flappy bird using Kaboom. 

# Steps to follow

We're going to cover how to add the following:

- Game objects and variables - adding gravity, speed and height of the pipes
- Collisions - events for when our player collides with the pipes
- Jump function - to keep our player flying through the pipes
- Score - adding a score each time player passes through a pipe
- Losing scene - events for when our player loses
- Restart Function - to keep playing the game after we lose

You can find the code we use at https://replit.com/@ritza/flappy-tutorial or you can try out the embedded repl below.

![Flappy](https://raw.githubusercontent.com/ritza-co/kaboom/kaboom-concept-tutorials/assets/screenshots/flappy.png)

# Getting started with the code

The first thing we want to do is load the `kaboom()` library and initialize a Kaboom context. 

```
import kaboom from "kaboom";

kaboom();
```

Next, we're going to load the assets we'll be using during the game. In this case, our player sprite and some cool sound effects.

```
loadSprite("bean", "/sprites/bean.png")
loadSound("score", "/sounds/score.mp3")
loadSound("wooosh", "/sounds/wooosh.mp3")
loadSound("hit", "/sounds/hit.mp3")
```

### Adding a player character

Games usually run in a loop that can update the events that take place as we play, such as keys pressed or character behaviors. So, we are going to place most of our code inside the `scene()` function.

```
scene("game", () => {
```

We have to add a player character for the game and also make sure to give the character an `area()` and a `body()` component. These two components will be used later when we program what happens when our player collides with the pipes and vertical edges as well as let our character respond to the gravity we've set in the game.


```
const bean = add([
    sprite("bean"),
    pos(width() / 4, 0),
    area(),
    body(),
])
```

We need to define some constant variables for the game, for the: gravity; distance of the opening between pipes; minimum sizes of the pipes; the jumping force of our player character; and the moving speed of the pipes.

```
gravity(3200)

const PIPE_OPEN = 240
const PIPE_MIN = 60
const JUMP_FORCE = 800
const SPEED = 320
const CEILING = -60
```

### Adding pipes

We want the pipes to appear in random heights every second to make the game more challenging. We're using a function called `spawnPipe()` to create new pipes and set their position at opposite vertical sides of the display.

```
function spawnPipe() {
    const h1 = rand(PIPE_MIN, height() - PIPE_MIN - PIPE_OPEN)
    const h2 = height() - h1 - PIPE_OPEN
// ...
```

Next, we want to add pipes by assembling the components comprising each game object. In this case, we want the pipes to be rectangular, to have an `area()`, used for collision detection, and to be able to move. Using `move()` ensures that it glides along the left side of the screen as the game progresses, and `cleanup()`  will remove the rectangle after it leaves the screen.

```
add([
    pos(width(), 0),
    rect(64, h1),
    color(0, 127, 255),
    outline(4),
    area(),
    move(LEFT, SPEED),
    cleanup(),
    "pipe",
])

add([
    pos(width(), h1 + PIPE_OPEN),
    rect(64, h2),
    color(0, 127, 255),
    outline(4),
    area(),
    move(LEFT, SPEED),
    cleanup(),
    "pipe",
    { passed: false, },
])
}
```

By using `onUpdate()`, we can check when our player passes through the pipes successfully, so that we can add a score and let the game continue on. Each pipe is given a pipe tag which is passed in the update function.

```
onUpdate("pipe", (p) => {
    if (p.pos.x + p.width <= bean.pos.x && p.passed === false) {
        addScore()
        p.passed = true
    }
})
```

Lastly, for the pipes, we'll create a loop so it calls on our spawnPipe() function every second, thereby creating new pipes after each second.

```
loop(1, () => {
    spawnPipe()
})
```

## Collisions

Here we're going to define the events for when our player character has a collision. The game runs in a main loop placed in `scene()`. For every iteration, the game updates to reflect the progress and register new events that occur. This process lets us check our player's position and we can check if they've had collisions yet or reached the edges of the screen.

When a player reaches the vertical edges or has collisions, we want to switch to the losing scene and execute events for when our player loses.

```
// Check if player has reached vertical edges
bean.onUpdate(() => {
	if (bean.pos.y >= height() || bean.pos.y <= CEILING) {
		go("lose", score)
	}
})

// Player collides with the pipes
bean.onCollide("pipe", () => {
	go("lose", score)
	play("hit")
	addKaboom(bean.pos)
})
```

## The jump function

Our player has to keep jumping to pass through the pipes to avoid falling to their death, the bottom edge of the display screen. As such, we've set a constant jump force.

```
onKeyPress("space", () => {
	bean.jump(JUMP_FORCE)
})

// mobile
onClick(() => {
	bean.jump(JUMP_FORCE)
})
```

## Adding a score

Our score is displayed on the screen and increments each time we pass through a pipe.

```
let score = 0

const scoreLabel = add([
	text(score),
	layer("ui"),
	origin("center"),
	pos(width() / 2, 80),
])

function addScore() {
	score++
	scoreLabel.text = score
	play("score")
}

})
```

## The losing scene

We need to define the events that would occur when our character loses, that is if they collide with one of the pipes or they touch the vertical edges of the display screen.

Our player character would be repositioned to the middle of the screen, along with their final score.

```
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

## Restart function

The code below allows us to restart the game when we lose.

```
onKeyPress("space", () => go("game"))
// mobile
onClick(() => go("game"))
```

# Things to try

You can visit https://kaboomjs.com/ to learn more about the Kaboom library.

Here are some suggestions on how to enhance the game:

- Create random color patterns for the pipes
- Add sound each time score increases or player passes through a pipe

You can also try out the repl below:

<iframe width="100%" height="400px" src="https://replit.com/@ritza/flappy-tutorial?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
