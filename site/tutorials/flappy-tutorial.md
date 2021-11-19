# Flappy with Kaboom.js

If you want a game that keeps you on the edge of your seat, flappy is the one for you.

Like the mobile game, Flappy bird, we control our player character as he flies between pipes -similar to a 
bird flapping its wings- trying not to hit them. 
We gain a point each time our character passes through a pipe.


In this tutorial, we are going to learn how to create our own version of Flappy bird using kaboom. 

# Steps to follow
We're going to cover how to add the following:

- Game objects and variables - adding gravity, speed and height of the pipes
- Collisions - Events for when our player collides with the pipes
- Jump function - To keep our player flying through the pipes
- Score - Adding a score each time player passes through a pipe
- Losing scene - Events for when our player loses
- Restart Function - To keep playing the game after we lose

You can find the code we use at https://replit.com/@ritza/Flappy or you can try out the embedded repl below.

![Flappy](flappy.png)

# Getting started with the code

## Game objects and variables

Games usually run in a loop that can update the events that take place as we play, such as keys pressed or character
behaviors. So, we are going to place most of our code inside the scene() function which is the loop function provided by the kaboom library.

### Adding a player character

We have to add a player character for the game and also make sure to give the character an area() and a body() component.
These two components will be used later when we program what happens when our player collides with the pipes and vertical edges as well as let our character respond to the gravity we've set in the game.


```

    const bean = add([
        sprite("bean"),
        pos(width() / 4, 0),
        area(),
        body(),
    ])

```

We need to define some constant variables for the game, for the:
gravity in the game; distance of the opening between pipes; minimum sizes of the pipes; the jumping force of our player character; and the moving speed of the pipes.

```
    gravity(3200)

    const PIPE_OPEN = 240
	const PIPE_MIN = 60
	const JUMP_FORCE = 800
	const SPEED = 320
	const CEILING = -60
```

### Adding pipes

We have to program the game such that, the pipes appear in random heights every second to make the game more challenging.
We can create a function spawnPipe() to call the create new pipes and set their position at opposite vertical sides of the display.

```

    function spawnPipe() {
        const h1 = rand(PIPE_MIN, height() - PIPE_MIN - PIPE_OPEN)
        const h2 = height() - h1 - PIPE_OPEN

```

Here we program the pipes which are rectangles, giving them an area() component for collisions, move() function so it glides along the left side of the screen as the game progresses, and cleanup() function will remove the rectangle after it leaves the screen.

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

Using the onUpdate() function we can check when our player passes through the pipes successfully, so we can add a score and let the game continue on. Each pipe is given a pipe tag which is passed in the update function.

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

Here we're going to define the events for when our player character makes a collision.
The game runs in a main loop placed in the scene() function. For every iteration, the game updates
to reflect the progress and register new events that occur. This lets us check our player's position and
we can check if they made collisions yet or reached the edges of the screen.

The losing scene runs outside of our main loop/ main scene so when our character makes collisions we set the program to switch to the losing scene and execute the events for when our player loses.

the following code registers events for when a player reaches the vertical edges


```
    bean.onUpdate(() => {
        if (bean.pos.y >= height() || bean.pos.y <= CEILING) {
            go("lose", score)
        }
    })

```


and the following code registers events for when a player collides with the pipes

```
    bean.onCollide("pipe", () => {
        go("lose", score)
        play("hit")
        addKaboom(bean.pos)
    })

```

## The jump function

Our player character has to keep jumping/ flying to pass through the beans and also not to
fall to their death -  the bottom edge of the display screen. We can set a declare a constant jump force our character and pass it as an argument for our jump function.

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

Our score appears at the top and center of the display screen and increments each time we pass through a pipe.

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

We need to define the events that would occur when or character loses, that is if they
collide with one of the pipes or they touch the vertical edges of the display screen.

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


## Restart funtion

This function is for restarting the game when we lose so we can keep on playing and restarting the game.
To achieve this, we will define what happens when we click the space key or game screen if we are using our mobiles,
once the game is over.

```
    onKeyPress("space", () => go("game"))
    onClick(() => go("game"))

```

That's it on the flappy tutorial.

# Thing to try

Here are some suggestions on how to enhance the game
- Create random color patterns for the pipes
- Add sound each time score increases or player passes through a pipe

### You can try out the repl below

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/Flappy?embed=true"></iframe>
