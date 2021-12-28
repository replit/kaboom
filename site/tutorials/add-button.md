# Adding a button with Kaboom

Kaboom is a fun library to create simple games. 

In this tutorial, we're going to look at how to add a simple button to the screen. You can find the link to the code at https://replit.com/@ritza/add-button-tutorial or check out the embedded code at the bottom of this tutorial. 

## Getting started with the code

The first thing we want to do to is load the `kaboom()` library and initialize a Kaboom context. 

```
import kaboom from "kaboom";

kaboom()
```

Next, we want to create a function to add our button. Our `addButton()` function takes in three parameters: the text we want displayed on the screen; the position of that text and the action we want taken when the button is clicked. 

```
function addButton(txt, p, f) {

    const btn = add([
        text(txt),
        pos(p),
	area({ cursor: "pointer", }),
	scale(1),
	origin("center"),
    ])
```

When adding our button, we use the `add()` function to assemble the list of components we'll need to define our button. 

Let's look at the components we're using:

- `text()` the string we want to render on the screen
- `pos()` the position of our text on the screen represented as X and Y coordinates 
- `area()` this method generates the collider area and enables collision detection; we also want a pointer when the mouse cursor is hovering over the button
- `scale()` allows us to describe the enlargement of the button text
- `origin()` origin point for render

Now that we've added our button, we want to be able to click on it. The `onClick()` function is used.

```
btn.onClick(f)
```

The code below shows how to call `addButton()`. In our simple example, we want the text "oh hi" to be displayed when the "Start" button is clicked and for the text "bye" to be displayed when the "Quit" button is clicked. Remember the function definition: `addButton(txt, p, f)` - in the code below, "Start" is our txt; p, the vec2(200, 100), is the position of our text on the screen represented by X Y coordinates (X: 200; Y: 100) and the anonymous function determines the action we want performed when the button is clicked.

```
addButton("Start", vec2(200, 100), () => debug.log("oh hi"))
addButton("Quit", vec2(200, 200), () => debug.log("bye"))
```

## Things you can try

In this tutorial, we learnt about simple button functionality in Kaboom. You can visit https://kaboomjs.com/ to learn more. 

Here are some suggestions to try:

- Change the appearance of the button when the mouse cursor hovers over it
- Use a different game object for the button instead of text

You can find the code for this tutorial here:

<iframe height="400px" width="100%" src="https://replit.com/@ritza/add-button-tutorial?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
