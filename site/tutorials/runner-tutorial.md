# Runner with kaboom.js

Runner is a speed game in which a player character runs on a surface jumping over trees and the longer he lasts in the game, the higher his score. It is much similar to google's [Dinosaur game](https://elgoog.im/t-rex/).

In this tutorial, we're going to learn how to create our own runner game with kaboom.js

# Steps to follow
We're going to cover how to add the following:

- Game objects and variables - Adding variables(e.g game speed), player characters, the floor surface
- The main events -  Adding trees, scores, player movement, and collisions in the main scene
- The losing scene - Events for when our player loses the game

You can find the code we use at https://replit.com/@ritza/Runner or you can try out the code in the embedded repl below.


![](runner.png)


## Game objects and variables

Before getting started with the main scene - the main game loop - we have to declare some constant variables for the height of the floor or player runs on, our player's jump force as well as the game speed.

```
const FLOOR_HEIGHT = 48
const JUMP_FORCE = 800
const SPEED = 480
```

We can experiment by altering these values but for now, we'll keep them constant. Inside the main scene, we can set a value for the gravity in the game so our player can stay grounded to the floor when running.

```
    gravity(2400)
```
### Adding a player

Here we'll add a player character, giving them an initial position on the game screen and also giving them area() and body() components to registers collisions and gravity.

```
    const player = add([
        sprite("bean"),
        pos(80, 40),
        area(),
        body(),
    ])
```

### Adding a floor surface

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

### Adding Trees

Firstly, we need a function to create tress, so that we can pass it inside the wait() function, to ensure it creates a new tree at random intervals during the game when called.

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
### Jump funtion

Now we're to create a jump function that will check whether our player is grounded to the floor and if so, it allows them to jump when the space button is pressed.


```
    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE)
        }
    }

    onKeyPress("space", jump)
    onClick(jump)

```
### Collisions

For collisions, if our player collides with any of the trees, we will lose the game. We can add some fun sound effects using the burp() function for these collisions.

```
    player.onCollide("tree", () => {
        go("lose", score)
        burp()
        addKaboom(player.pos)
    })

```
### Adding scores

Now to add the last part of the main scene, the score.

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

## The losing scene

When our player collides with a tree that's when they lose the game. When this happens, our score will be displayed at the center of the screen along with our character.

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
Once the game is over we can restart and keep playing by pressing the space key or game screen.

```
    onKeyPress("space", () => go("game"))
    onClick(() => go("game"))

```

That's it on creating a runner game with kaboom.js.


# Things you can try
 Here's a suggestion to improve the game display
- Changing the background of the game screen

## You can try out the repl below


<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/Runner?embed=true"></iframe>
