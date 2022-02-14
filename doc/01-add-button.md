# Adding a button with Kaboom

Kaboom is a fun library to create simple games. 

In this tutorial, we're going to look at how to add a button to the screen. You can find the code we use [on our repl](https://replit.com/@ritza/add-button-tutorial), or check out the embedded code at the bottom of this tutorial. 

## Getting started with the code

First, we'll load the `kaboom()` library and initialize a Kaboom context: 

```js
import kaboom from "kaboom";

kaboom()
```

Next, we'll create a function to add our button. Our `addButton()` function takes in three parameters: the text we want displayed on the screen, the position of the text, and the action we want taken when the button is clicked:

```js
function addButton(txt, p, f) {

    const btn = add([
        text(txt),
        pos(p),
	area({ cursor: "pointer", }),
	scale(1),
	origin("center"),
    ])
```

Here we use the `add()` function to assemble the list of components we'll need to define our button. 

Let's look at the components we're using:

- `text()` - the string we want to render on the screen
- `pos()` - the position of our text on the screen, represented as X and Y coordinates 
- `area()` - to generate the collider area and enable collision detection; we also specify a pointer when the mouse cursor hovers over the button
- `scale()` - allows us to describe the enlargement of the button text
- `origin()` - the origin point for render

Now that we've added our button, we want to be able to click on it. We'll use the `onClick()` function:

```js
btn.onClick(f)
```

Here's the code to call `addButton()`:

```js
addButton("Start", vec2(200, 100), () => debug.log("oh hi"))
addButton("Quit", vec2(200, 200), () => debug.log("bye"))
```

Remember the function definition: `addButton(txt, p, f)`. In our example, `"Start"` is our `txt`, `vec2(200, 100)` is our `p` (the postiion of our text on the screen, represented by XY coordinates), and the anonymous function determines the action we want performed when the button is clicked. The text "oh hi" is displayed when the "Start" button is clicked, and "bye" is displayed when the "Quit" button is clicked.

## Things you can try

Here are some you can try:

- Change the appearance of the button when the mouse cursor hovers over it.
- Use a different game object for the button instead of text.

You can find the code for this tutorial here:

<iframe height="400px" width="100%" src="https://replit.com/@ritza/add-button-tutorial?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
