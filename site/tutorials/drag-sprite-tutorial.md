# Drag game objects with Kaboom 

Creating simple games is easy and fun with Kaboom.

In this tutorial, we're going to see how to drag game objects, also known as sprites. You can find the link to the code at https://replit.com/@ritza/drag-sprite-tutorial or check out the embedded code at the bottom of this tutorial.

## Things to consider

The main things that we want to consider are as follows:

- We want to keep track of the sprite we're dragging
- We want to create a custom component for handling drag and drop behaviour
- We want to add sprites that are draggable

## Getting started with the code

The first thing we want to do to is load the `kaboom()` library and initialize a kaboom context.

```
import kaboom from "kaboom";

kaboom()
```

Next, we want to keep track of the current object we're dragging. 

```
let curDraggin = null
```

In Kaboom, each game object comprises a list of components that define the functionality of that object, which are assembled in the `add()` function. As a result, we're going to create a custom component that allows us to handle drag and drop behaviour. We're going to create a function called `drag()` in which we'll assemble all the components required to drag and drop objects. 

This function is responsible for keeping track of the position of the mouse and that of the object we're currently dragging. The position is represented as a 2D vector (vec2), using X and Y coordinates.

The code below shows the `drag()` function:

```
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

Now that we've defined our custom component, we want to register drop our sprite. For this, we use the `onMouseRelease()` event handler.

```
// drop
onMouseRelease(() => {
    curDraggin = null
})
```

Now we're ready to add our component:

```
// adding dragable objects
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

Here are some suggestions of how you can extend this code further:

- Add multiple game objects to the screen that you can drag and drop

You can try out the code in the embedded repl below:

<iframe height="400px" width="100%" src="https://replit.com/@ritza/drag-sprite-tutorial?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
