# Adding text with kaboom

Kaboom is a fun library to create simple games.

In this tutorial, we're going to learn how to add text to the screen with kaboom. You can find the link to this repl at 
[https://replit.com/@ritza/text-tutorial](https://replit.com/@ritza/text-tutorial).

## Steps to follow

We're going to learn how to:

* Add fonts
* Add text input and animation
* Register keyboard input

![add text](add-text.png)

## Getting started with the code

The first thing we want to do is load the kaboom() library and initialize a Kaboom context.

```
import kaboom from "kaboom";

kaboom()
```
## Adding fonts
Now, we'll load the fonts we want to use for our text. We'll start by loading a custom bitmap font specifying the width and height for each character.

```
loadFont("unscii", "/fonts/unscii_8x8.png", 8, 8)
```

Next, we'll create a list of built-in fonts that we can cycle through.

```
const builtinFonts = [
    "apl386o",
    "apl386",
    "sinko",
    "sink",
]
```
The "fonts" list will contain the list of built-in fonts as well as the custom font we previously added.
This we'll make it easier for us to cycle between both custom and built-in fonts without having to call them each separately.
```
const fonts = [
    ...builtinFonts,
    "unscii"
]
```

We want to keep track of what font is currently being used as well as the font size and the padding between the text and edges of the screen.
Let's create a variable for each of these qualities.

```
let curFont = 0
let curSize = 48
const pad = 24
```


## Adding text and animation

Now we'll create a new game object "input" that we'll use to render text to the screen.

```
const input = add([
    pos(pad),
    // Render text with the text() component
    text("Type! And try arrow keys!", {
        font: fonts[curFont],
        width: width() - pad * 2,
        size: curSize,
        lineSpacing: 8,
        letterSpacing: 4,
```

The following block code creates an animation effect for our text, giving it a wavy motion effect and rainbow colors.

```
        transform: (idx, ch) => ({
            color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
            pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
            scale: wave(1, 1.2, time() * 3 + idx),
            angle: wave(-9, 9, time() * 3 + idx),
        }),
    }),
])
```

## Register keyboard input

Now we're going to add functionality that will allow us to type in and modify our text using the keyboard.

We'll start by registering an event that runs when we input text. "onCharInput()" will call our input object's text attribute to add what we type in on the keyboard.

```
onCharInput((ch) => {
    input.text += ch
})
```
Here we'll use "onKeyPressRepeat()" to register when we press enter to insert a new line or backspace to delete the last character.
```
onKeyPressRepeat("enter", () => {
    input.text += "\n"
})


onKeyPressRepeat("backspace", () => {
    input.text = input.text.substring(0, input.text.length - 1)
})
```

Lastly, we want to be able to use the arrow keys to switch back and forth between the fonts we have. The left key will go to the previous font and the right key will go to the next font.

```
onKeyPress("left", () => {
    if (--curFont < 0) curFont = fonts.length - 1
    input.font = fonts[curFont]
})

onKeyPress("right", () => {
    curFont = (curFont + 1) % fonts.length
    input.font = fonts[curFont]
})
```

We're going to create variables to control the size of the text, the speed at which the text increases in size when we use it, and the maximum size of our text.

```
const SIZE_SPEED = 32
const SIZE_MIN = 12
const SIZE_MAX = 120
```

The up and down keys will be used to increase and decrease the size of the text. 

```
onKeyDown("up", () => {
    curSize = Math.min(curSize + dt() * SIZE_SPEED, SIZE_MAX)
    input.textSize = curSize
})

onKeyDown("down", () => {
    curSize = Math.max(curSize - dt() * SIZE_SPEED, SIZE_MIN)
    input.textSize = curSize
})
```

we can use the following syntax and style options to style chunks of text.
```
add([
    text("[oh hi].green here's some [styled].wavy text", {
        width: width(),
        styles: {
            "green": {
                color: rgb(128, 128, 255),
            },
            "wavy": (idx, ch) => ({
                color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
                pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
            }),
        },
    }),
    pos(pad, height() - pad),
    origin("botleft"),
])
```
That's it on how to add text to the screen with kaboom.

### Components we used

* pos() - Used to set the position of the text
* hsl2rgb() - Convert HSL color (all values in 0.0 - 1.0 range) to RGB color giving our text a rainbow color effect.
* vec2() - adds a 2d vector to the text
* wave() - adds a wavy effect to the text, interpolating it between two values/points.
* scale() - adds a scaling effect to the text, making text shrink and expand.
* angle() -  handles the slight rotation effect of the texts.

## Things to try

If you'd like to challenge yourself here are some things you can try out yourself:

- add a random font style to each new character you type in.
- create a dialog response for user input
