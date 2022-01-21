# Pong with Kaboom

Pong is one of the classic tennis-like arcade games that have over the years become less popular. It's one of the first computer games ever created in the year 1972 and as a classic, this game would trigger some nostalgia.

Using kaboom's library we can create our own two-dimensional game of pong with less than one hundred lines of code. 

In this tutorial, we're going to create a pong game that lets us play against ourselves using paddles we can move vertically on the left and right sides of the game display screen.

# Step to follow:

We're going to learn how to add the following:

- Paddles - Adding paddles on horizontal opposites of display
- Paddle movement - Using our mouse to the control paddles
- Pong ball - Creating the game ball
- Collisions - Events for when the ball collides with the paddles

You can find the code we use for this tutorial at https://replit.com/@ritza/pong-tutorial or you can try the embedded repl below.

![Pong](https://raw.githubusercontent.com/ritza-co/kaboom/kaboom-concept-tutorials/assets/screenshots/pong.png)

## Getting started with the code

The first thing we want to do is load the `kaboom()` library and initialize a Kaboom context with a yellow background. 

```
import kaboom from "kaboom";

kaboom({
    background: [ 255, 255, 128 ]
})
```

Next, we're going to add our digital rackets. We're going to create two paddles, each positioned on the opposite ends of the screen, with strictly vertical movement.

```
add([
    pos(40, 0),
    rect(20, 80),
    outline(4),
    origin("center"),
    area(),
    "paddle",
])

add([
    pos(width() - 40, 0),
    rect(20, 80),
    outline(4),
    origin("center"),
    area(),
    "paddle",
])
```

The two paddles in the pong game have synchronized movement. We can achieve this functionality by syncing the vertical movement of our mouse with the movement of our paddles.

```
onUpdate("paddle", (p) => {
    p.pos.y = mousePos().y
})
```

The ball in the pong game usually moves from the center when the game starts to one of the paddles. We can position it in the center of our display when the game starts.

```
const ball = add([
    pos(center()),
    circle(16),
    outline(4),
    area({ width: 32, height: 32, offset: vec2(-16) }),
    { vel: dir(rand(-20, 20)) },
])
```

When the ball touches either paddle it will bounce off it and change direction towards the opposite side of the screen. The ball will bounce off the vertical edges of our game display area. However, if the ball touches the edge of the left or right edges of the screen we lose the game.

Now we'll add the functionality for when the ball touches the vertical or horizontal edges.

```
ball.onUpdate(() => {
    ball.move(ball.vel.scale(speed))
    if (ball.pos.x < 0 || ball.pos.x > width()) {
        score = 0
        ball.pos = center()
        ball.vel = dir(rand(-20, 20))
        speed = 320
    }
    if (ball.pos.y < 0 || ball.pos.y > height()) {
        ball.vel.y = -ball.vel.y
    }
})
```

Lastly, we'll add the functionality for when the ball touches the paddles. The ball will change direction and head towards the opposite end, depending on the angle at which it hit the paddle.

```
ball.onCollide("paddle", (p) => {
    speed += 60
    ball.vel = dir(ball.pos.angle(p.pos))
    score++
})
```

# Things you can try

You can follow https://kaboomjs.com/ to learn more about the Kaboom library.

Here are some suggestions you can try to enhance the game:

- Change the ball to a different color each time it collides with the paddles
- Add sound for when the ball collides with the paddles

You can try out the code in the embedded repl below:

<iframe height="400px" width="100%" src="https://replit.com/@ritza/pong-tutorial?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
