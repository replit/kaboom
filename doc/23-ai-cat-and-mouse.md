# AI cat-and-mouse with Kaboom

In this tutorial, we will demonstrate how we can use artificial intelligence (AI) to create a cat-and-mouse game in which a player has to escape an enemy chasing and shooting at them.

We will provide the computer with a few sets of instructions and allow it to handle the movement of the enemy sprite. All we have to control are the player's movement when playing the game.

![ai](ai.png)

You can find the code for this tutorial on [our repl](https://replit.com/@ritza/ai-cat-and-mouse) or try the embedded repl below.

We'll cover the following:
* Adding game objects
* Adding state behavior
* Detecting collisions
* Adding player movement

## Getting started with the code

Use the following code to initialize a Kaboom context:

```javascript
import kaboom from "kaboom"

kaboom()
```

We'll need two sprites for the game we're building. Add the following imports below the previous code:

```javascript
loadSprite("bean", "/sprites/bean.png")
loadSprite("ghosty", "/sprites/ghosty.png")
```

Let's declare a few constants for the moving speed of each of our sprites in the game. Add the following code below the sprite imports:

```javascript

const SPEED = 320
const ENEMY_SPEED = 160
const BULLET_SPEED = 800
```

## Adding game objects

We need to create game objects to hold our player and enemy sprites. Let's start with our player:

```javascript

const player = add([
    sprite("bean"),
    pos(80, 80),
    area(),
    origin("center"),
])
```

In the code above, we assign the "bean" sprite to the player object we've created. Using the `pos()` function, we give it a starting position at the top-left corner of the game screen when the game begins. With the `area()` function, we give the player a body that we will use to register collisions, either with the enemy sprites or with the bullets.

Add the following code for the enemy sprite:

```javascript
const enemy = add([
    sprite("ghosty"),
    pos(width() - 80, height() - 80),
    origin("center"),
    state("move", [ "idle", "attack", "move"]),
])
```

The second sprite "ghosty" is assigned to the enemy object. The `state()` function is used to define a finite state machine for the enemy's behaviour. The first argument (`"move"`) is the initial state of our enemy, while the second one is the list of states that the enemy will transition between: "idle", "attack", and "move".
  
## Adding state behavior
In this section, we will determine what happens in all three states of the enemy sprite. We use the `onStateEnter()` function to switch between the different states. When entering the "idle" state, we use `wait()` to wait 0.5 seconds before switching to the "attack" state.


```javascript
enemy.onStateEnter("idle", async () => {
    await wait(0.5)
    enemy.enterState("attack")
})

```

Add the following code below the previous `onStateEnter()` to enter the "attack" state:

```javascript
enemy.onStateEnter("attack", async () => {
    if (player.exists()) {

        const dir = player.pos.sub(enemy.pos).unit()

        add([
            pos(enemy.pos),
            move(dir, BULLET_SPEED),
            rect(12, 12),
            area(),
            cleanup(),
            origin("center"),
            color(BLUE),
            "bullet",
        ])

    }

    await wait(1)
    enemy.enterState("move")

})
```

In the line `const dir = player.pos.sub(enemy.pos).unit()`, we get the direction of the player's position relative to the enemy's position. We'll use this direction when shooting bullets at the player.

In the `add()` function, we create a new bullet by creating a small, blue rectangle "coming from" the enemy sprite. Once the bullet reaches the player's position, the `area()` component will be used to determine if there was a collision. If there was no collision, the `cleanup()` function will remove the bullet when it leaves the game screen.

The enemy will then wait one second after firing a bullet before switching to the "move" state.

Similarly to the "idle" state, the enemy will wait 2 seconds in the "move" state before switching to idle. Add the following code below the previous `onStateEnter()` function to implement the "move" state:

```javascript
enemy.onStateEnter("move", async () => {
    await wait(2)
    enemy.enterState("idle")
})
```

The enemy needs to keep chasing the player object while it still exists and as long as it hasn't been hit by a bullet. If the player object has been hit by a bullet, it will disappear. 

The `onStateUpdate()` function will run with every frame if the current state of the enemy object is "move".

```javascript

enemy.onStateUpdate("move", () => {
    if (!player.exists()) return
    const dir = player.pos.sub(enemy.pos).unit()
    enemy.move(dir.scale(ENEMY_SPEED))
})
```

The line `if (!player.exists())` will make us return from the function if the player object no longer exists, otherwise the enemy will keep moving in the direction of the player object.

The following code will call the `enterState()` function to initiate the state changes after the game begins. Add this below the `onStateUpdate()` function:

```javascript
enemy.enterState("move")
```

## Detecting collisions

If the player collides with a bullet, both the player and the bullet will disappear. Add the following code below the `enterState()` function to implement this behavior:

```javascript
player.onCollide("bullet", (bullet) => {
    destroy(bullet)
    destroy(player)
    addKaboom(bullet.pos)
})
```

The `destroy()` function in the code above will remove both the bullet and the player from the game screen.


## Adding player movement
To move our player, we will use the keyboard arrow keys. Add the following code below the `onCollide()` function:

```javascript
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

### Things to try

Here are some ideas to make the game more entertaining:

- Try to add some background music for the duration of the game.
- Add a score or timer and a new enemy sprite if the player reaches a certain score or time.


You can try out the code in the embedded repl below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/ai-cat-and-mouse?embed=true"></iframe>

