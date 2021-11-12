# Adding a game object with Kaboom.js

Kaboom is a fun library to use for creating simple games.

Adding game objects to a game is a fundamental part of creating games.

In Kaboom, the characters such as players, bullets, rocks, clouds, text etc. that we add to a game are called Game Objects. In other words, a game object is the basic unit of entity in a Kaboom world. 

In this tutorial, we'll look at how game objects, also known as sprites, are added to a game. The code we'll look at is considered boilerplate code (or rather a template) for starting most games we can create with Kaboom. For any game you may want to create, you need to know how to add sprites as a result, we'll discuss it at length to form a good foundation for game development in Kaboom.

## Creating a new project in Replit

Head over to [Replit](https://replit.com) and create a new repl. Choose **Kaboom** as your project type. Give this repl a name, like "AddSprite".

After the repl has booted up, you should see a `main.js` file under the "Code" section. You'll see some code already written for you to add a sprite.

## Understanding the code

The first thing we need to do is to import the `kaboom` library and initialize the context with the `kaboom()` function. This enables us to create a blank canvas with a nice checkerboard pattern as shown in the image below. Any sprite we'll need for the game will be added to this checkerboard screen.

```
import kaboom from "kaboom";

// initialize context
kaboom();
```

![Checkerboard pattern](https://kaboomjs.com/site/doc/intro/empty.png)

The code below allows us to load an image we'll use as a sprite. Introducing Frog the "Bean"! A happy frog that enjoys life. You'll see Bean a lot around here.

```// load assets
loadSprite("bean", "sprites/bean.png");
```

Now we want to add Bean to the screen. 

```// add a character to screen
add([
	// list of components
	sprite("bean"),
	pos(80, 40),
	area(),
    color(0, 0, 255),
]);
```

Each game object is composed from multiple components. For example, some component might decide the shape, another might decide if it should be subject to gravity, another might decide what color it is in and so on. Each component provides different functionalities and in the code example above, `add()` is the function used to assemble all the components into a game object in Kaboom.

## A closer look at the components used:

- `sprite()` makes it render a sprite with the 'bean' we just loaded with `loadSprite()`
- `pos()` gives it a position on the screen, at X:80 Y:40
- `area()` gives it a collider area and enables collision detection
- `color()` changes the color to blue

There are many more components that can be used. More information on these can be found at https://kaboomjs.com/. Take a look and play around with the code.

## Things to try

Here are some suggestions of how you can extend this code further:

- Add other components to Bean's character. Can you change the shape?
- Play around with different sprites, positions, rotations, and scale 