# Button Sprite Dialogs with Kaboom

In this tutorial, we'll learn how to create buttons and dialogs with objects in Kaboom.js

At the end, you should know how to:

* Create button-like behaviour with sprites
* Create dialogs between sprites

![display](button-sprites.png)

You can find the code for this tutorial at https://replit.com/@ritza/buttons-and-dialogs

## Getting started with the code

Let's begin by initializing a kaboom context by adding the following lines of code:

```javascript
import kaboom from "kaboom"

kaboom({
	background: [152,251,152 ],
}
```

The `kaboom()` function creates a context with a pale green background color.

## Buttons

What to consider when programming a particular object to act as a button is the logic you want to be applied when that object is clicked. You're not programming a button but an object to *behave* as a button.

Using kaboom's `onClick()` function we can create an object that behaves as a button and displays a message when we click on it. 

Add the following code, to load the sprite into the context:

```javascript
loadSprite("sun", "/sprites/sun.png")
```
Create a sun object with the loaded sprite.

```javascript
const sunny = add([
	sprite("sun"),
	origin("center"),
	pos(center().sub(-250, 210)),
  area() 
])
```

The `area()` function allows us to use the `onClick()` function on the sprite. Let's add a text box to show output when we click on the sprite.

```javascript

const textbox = add([
	rect(width() - 200, 120, { radius: 32 }),
	origin("center"),
	pos(center().x, height() - 100),
	outline(2),
])

const txt = add([
	text("", { size: 32, width: width() - 230 }),
	pos(textbox.pos),
	origin("center")
])
```

To show how adding the `onClick()` function will let us to give the object button-like behavior, add the following line of code then run the program:

```javascript
sunny.onClick(()=> txt.text="sunny: Burn losers!!")
```
If you click on the sprite you will see a message displayed in the textbox on the screen. This is a basic example of how to create an object that behaves like a button. We could also create a function to pass into the `onClick()` rather than just display simple text.

Let's create a hovering effect for the object so that each time our mouse moves over it, it changes behavior. Add the following line of code above `sunny.onClick()`:

```javascript
sunny.onUpdate(() => {
		if (sunny.isHovering()) {
			const t = time() * 10
			sunny.color = rgb(
				wave(0, 255, t),
				wave(0, 255, t + 2),
				wave(0, 255, t + 4),
			)
			sunny.scale = vec2(1.2)
		} else {
			sunny.scale = vec2(1)
			sunny.color = rgb()
		}
	})
```

If you run the program and hover over the sun object, you'll see it transition between different colors in a wave-like motion. This `onHovering()` function comes in handy when you create multiple buttons and you want to see which is currently active before you click on it.

## Sprite Dialogues

We can use these behaviors on multiple sprites. To show this, let's create dialogs between several sprites using the `onClick()` function and also using keyboard keys.

Add the following code below `loadSprite("sun", "/sprites/sun.png")` to load the  "bean" and "goldfly" sprites into the context:

```javascript
loadSprite("bean", "/sprites/bean.png")
loadSprite("goldfly", "/sprites/goldfly.png")
```
Create objects with these sprites:

```javascript
const bean = add([
	sprite("bean"),
	origin("center"),
	pos(center().sub(80, -50)),
  area(),
])

const goldy = add([
	sprite("goldfly"),
	origin("center"),
	pos(center().sub(-100, -80)),
  area(),
])
```

Let's add some dialogs for each sprite so they communicate each time we click on them.

```javascript
const beanSpeech = [ "Hello warm sunshine",  "Today is such a nice day, isn't it Goldy?", "The sun makes everything brighter", "Summer is the best season", "It should be summer all year round" ]

const goldySpeech = [
	 "It's so hot.", "How can you say that?!", "The sun is basically cooking us alive", "I don't think I can go on anymore,  I'm melting", "You got rifle? I think we can shoot it down"

goldy.onClick(()=> txt.text=goldySpeech[Math.floor(Math.random() * goldySpeech.length)])
bean.onClick(()=> txt.text=beanSpeech[Math.floor(Math.random() * beanSpeech.length)])

```
If you run the program, you'll see that out two sprites "bean" and "goldy" interact when they are each clicked on.

We coud also use keyboard keys to give our sprites this behaviour. Let's create two sprites that only communicate when we click on the space key.

Let's add two last sprites, "bobo" and "mark", and load them into the context.

```javascript
loadSprite("bobo", "/sprites/bobo.png")
loadSprite("mark", "/sprites/mark.png")

```
This time we'll create one array for the dialog between the two loaded sprites and create one object that will switch between the two sprites based on which one is currently talking.

```javascript
const dialogs = [
	[ "bobo", "Hey mark!" ],
	[ "mark", "what?" ],
	[ "bobo", "Isn't the sun nice and warm today?" ],
	[ "mark", "No" ],
	[ "bobo", "Come there's clear skies too, it's so pretty" ],
	[ "mark", "Aren't you a fish? Won't you die of dehydration." ],
	[ "bobo", "That's not the point!" ],
	[ "mark", "Uh huh?" ],
]

const avatar = add([
	sprite("bobo"),
	origin("center"),
	pos(center().sub(0, 50))
])
```
Let's program the "space" key on our keyboard to update the dialogs each time we press it.

``` javascript

let curDialog = 0

onKeyPress("space", () => {
	curDialog = (curDialog + 1) % dialogs.length
	updateDialog()
})
```
This next function `updateDialog()` is referenced when we were implementing the space key, it is responsible for switching or updating sprites in the "avatar" object we created and also the dialog depending on which sprite is currenty the avatar because we specified both the sprite and it's speech in each element in the "dialogs" array.

```javascript
function updateDialog(curSprite) {

	const [ char, dialog ] = dialogs[curDialog]

	avatar.use(sprite(char))
	txt.text = char + ": " + dialog

}

updateDialog()
```

If you run the program, you'll see that each time you click on the space key, the sprites switch based on who is currently talking.

So we can program any object to behave as a button. Using the `onKeyPress()` function, we can also create control functions for a audio player or to control a player's movement for example. This bevaiour isn't limited to on screen button objects.

### Here are some programs you can try out to challenge yourself:

* Create buttons to control a sprite's movement.
* Use keyboard keys to imitate piano keys.

You can find the code forthis tutorial here:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/buttons-and-dialogs?embed=true"></iframe>
