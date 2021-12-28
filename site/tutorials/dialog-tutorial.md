# Creating dialogs with Kaboom 

Kaboom is a fun library that enables the creation of simple games.

In this tutorial, we're going to look at how to create dialogs on the screen. 

You can find the link to the code at https://replit.com/@ritza/dialog-tutorial or check out the embedded code at the bottom of the tutorial.

## Getting started with the code

The first thing we want to do is load the `kaboom()` library and initialize a Kaboom context with a pink background. 

```
import kaboom from "kaboom";

kaboom({
    background: [ 255, 209, 253 ]
})
```

Next, we want to load the sprites we'll be using. Introducing "Bean" the Frog and "Bobo" the Fish.

```
loadSprite("bean", "/sprites/bean.png")
loadSprite("bobo", "/sprites/bobo.png")
```

We want to define the dialogue data to display when the space bar is clicked. The data is stored in a nested array for easy access.

```
const dialogs = [
    [ "bean", "hi my butterfly" ],
    [ "bean", "i love u" ],
    [ "bean", "you love me? pretty baby" ],
    [ "bean", "bobo is a stupid" ],
    [ "bean", "he did not know how to take care of you..." ],
    [ "bobo", "you don't know me ..." ],
    [ "bean", "what! bobo???" ],
    [ "bobo", "oh...hi " ],
]

// Keep track of the current dialog data
let curDialog = 0
```

Now that we've defined our data, we want to define the properties for the textbox we'll be using to contain the dialog text. The `add()` function is used to assemble all the components that game objects comprise. 

```
// Textbox properties
const textbox = add([
    rect(width() - 200, 120, { radius: 32 }),
    origin("center"),
    pos(center().x, height() - 100),
    outline(2),
])
```

The code below is used to define the properties for the text to be displayed inside the textbox.

```
// Text properties
const txt = add([
    text("", { size: 32, width: width() - 230 }),
    pos(textbox.pos),
    origin("center")
])
```

Next, we want to add a sprite 'bean' to the screen, which is positioned at the center of the screen.

```
// Character avatar
const avatar = add([
    sprite("bean"),
    scale(3),
    origin("center"),
    pos(center().sub(0, 50))
])
```

Now we want to cycle through the dialog text every time the space bar is clicked. The `updateDialog()` function allows us to update the sprite from Bean to Bobo while also updating the text. 

```
onKeyPress("space", () => {
    // Cycle through the dialogs
    curDialog = (curDialog + 1) % dialogs.length
    updateDialog()
})

// Update the on screen sprite & text
function updateDialog() {

    const [ char, dialog ] = dialogs[curDialog]

    // Use a new sprite component to replace the old one
    avatar.use(sprite(char))
    // Update the dialog text
    txt.text = dialog

}

updateDialog()
```

## Things to try

You can follow https://kaboomjs.com/ to learn more about the Kaboom library. 

Here are some suggestions of how you can extend this code further:

- Change the appearance of the background to something else, say an image
- Enable input handling for a key other than the space bar

You can try out the code in the embedded repl below:

<iframe height="400px" width="100%" src="https://replit.com/@ritza/dialog-tutorial?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
