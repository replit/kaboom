# Drag game objects in Kaboom 

In this tutorial, we'll show you how to drag game objects, also known as sprites. You can find the the code [on our repl](https://replit.com/@ritza/drag-sprite-tutorial) or check out the embedded code at the end of this tutorial.

## Things to consider

To drag game objects, we need to:

- keep track of the sprite we're dragging,
- create a custom component for handling drag-and-drop behaviour, and
- add sprites that are draggable.

## Getting started with the code

Let's start by loading the Kaboom library and initializing a Kaboom context:

```js
import kaboom from "kaboom";

kaboom()
```

## Keeping track of the object

Next, we'll initialize a variable so that we can keep track of the object when we drag it. 

```js
let curDraggin = null
```

## Creating a custom component to handle drag-and-drop behaviour

In Kaboom, each game object comprises a list of components that define the functionality of that object. Components are assembled in the `add()` function.

We're going to create a custom component that allows us to handle drag-and-drop behaviour. We'll call our function `drag()`. Here's the code:

```js
function drag() {

    // The displacement between object pos and mouse pos
    let offset = vec2(0)
    
    return {
    
    // Name of the component
    id: "drag",
    // This component requires the "pos" and "area" component to work
    require: [ "pos", "area", ],
    // "add" is a lifecycle method gets called when the obj is added to scene
    add() {
       // "this" in all methods refer to the obj
       this.onClick(() => {
           if (curDraggin) {
	       return
	   }
	
           curDraggin = this
           offset = mousePos().sub(this.pos)
           // Remove the object and re-add it, so it'll be drawn on top
           readd(this)
       })
     },
     // "update" is a lifecycle method gets called every frame the obj is in scene
     update() {
	    if (curDraggin === this) {
	        cursor("move")
		this.pos = mousePos().sub(offset)
	    }
      },
    }

}
```

Here we've assembled all the components we need to drag and drop objects. Our `drag()` function keeps track of the position of the mouse, and the position of the object we're currently dragging. Position is represented as a 2D vector (vec2), using XY coordinates.

Now that we've defined our custom component, we want to register when we drop our sprite. For this, we use the `onMouseRelease()` event handler:

```js
// drop
onMouseRelease(() => {
    curDraggin = null
})
```

## Adding a draggable object

Now we're ready to add an object with our custom component:

```js
// adding draggable objects
add([
  sprite("bean"),
  pos(rand(width()), rand(height())),
  area(),
  scale(5),
  origin("center"),
  // using our custom component here
  drag(),
])

// reset cursor to default at frame start for easier cursor management
onUpdate(() => cursor("default"))
```

## Things to try

If you'd like to extend this code further, you could try adding multiple game objects to the screen that you can drag and drop.

You can try out the code in the embedded repl below:

<iframe height="400px" width="100%" src="https://replit.com/@ritza/drag-sprite-tutorial?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
