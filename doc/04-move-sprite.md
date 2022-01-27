# Moving a game object with Kaboom.js

Kaboom is a fun library to use for creating simple games.

Input handling and basic player movement is an important part of game development. Therefore, we're going to learn these basics.

## Steps to follow

We'd like to register the following inputs and movements:

- Moving to the right (pressing the right arrow key)
- Moving to the left (pressing the left arrow key)
- Moving up (pressing the up arrow key)
- Moving down (pressing the down arrow key)
- Moving to a specific position (clicking on the left-side of the mouse)

## Getting started with the code

You can check out the code to handle inputs and movements at https://replit.com/@ritza/move-sprite-tutorial or see the embedded code at the bottom of this tutorial.

## Step 1 - adding a player game object

The first step we're going to do is to add a player game object using the code below:

```js
// add a player game object to screen
const player = add([
	// list of components
	sprite("bean"),
	pos(center()),    // center() returns the center point vec2(width() / 2, height() / 2)
	area(),
    color(0, 0, 255),
]);
```

We created a `player` variable to enable us to manipulate the 'bean' sprite using methods later on. Methods allow us to perform certain actions on sprites. For example, if we want to handle movements such as jumping, checking for collisions, and as we'll see in this tutorial, changing directions.

## Step 2 - moving to the right 

We want to register movement to the right that's triggered every time the right arrow key is pressed. The `onKeyDown()` method handles this event for us. It says: "move right by x number of pixels per frame every frame when the right arrow key is being held down".
 
The `move()` method essentially tells the player to move towards a certain direction with a certain speed - `move(direction, speed)`. `move()` uses the `pos()` component defined in the `add()` method. 

We need to recognize the game as a grid on an X, Y axis. In the code example below, the direction is determined by the vector (320, 0). The direction is represented by a 'vec2' data type, which Kaboom uses to work with X and Y coordinates. In other words, the direction is (X: 320, Y: 0). This tells the sprite to move horizontally by 320 pixels per frame along the x-axis. 

```js
const SPEED = 320;

onKeyDown("right", () => {
	player.move(SPEED, 0)
})
```

## Step 3 - moving to the left

We want to register movement to the left that's triggered every time the left arrow key is pressed. `onKeyDown()` and `move()` are used as seen in the previous example however, the direction is to the left therefore we use a negative sign to indicate horizontal movement towards the left side along the x-axis.

```js
onKeyDown("left", () => {
	player.move(-SPEED, 0)
})
```

## Step 4 - moving up

We want to register upward movement that's triggered every time the up arrow key is pressed. `onKeyDown()` and `move()` are used as previously seen however, the direction is upward therefore we use the number 0 to indicate no movement along the x-axis. A negative sign is used to indicate upward vertical movement along the y-axis.

```js
onKeyDown("up", () => {
	player.move(0, -SPEED)
})
```

## Step 4 - moving down

We want to register downward movement that's triggered every time the down arrow key is pressed. `onKeyDown()` and `move()` are used however, the direction is downward therefore we're still using the number 0 to indicate no movement along the x-axis. A positive number is used to indicate downward vertical movement along the y-axis.

```js
onKeyDown("down", () => {
	player.move(0, SPEED)
})
```

## Step 5 - moving to a specific position

What if we want to use a mouse to move sprites? Kaboom also enables us to register events that are triggered when a mouse is clicked. In this case, we want 'bean' to move to the position indicated when left-clicking a mouse.

`onClick()` registers an event that runs once when the left mouse is clicked while	`moveTo()` is provided by the `pos()` component and changes the position.

```js
onClick(() => {
	player.moveTo(mousePos())
})
```

## Things to try

There are lots more ways to handle inputs and movements in Kaboom. Check out https://kaboomjs.com/ to learn more.

Some suggestions to challenge yourself:

- Use other keys with `onKeyDown()` such as "space" or a letter like "w" etc.
- Can you make sprites appear in random positions? Hint: what method can you use to generate random numbers to assign a location that a sprite can appear from?

You can find the code for this tutorial here:

<iframe height="400px" width="100%" src="https://replit.com/@ritza/move-sprite-tutorial?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
