# Creating gravity with Kaboom.js

<br>

[Kaboom](https://kaboomjs.com/) is a fun library for creating simple javascript games.
This library provides a lot of useful functions that make programming game objects easier to understand and use.

In this tutorial, we're going to learn how to create the gravity effect for game objects using kaboom. You can find the code we use at https://replit.com/@ritza/Gravtiy or you can try the code in the embedded repl below.


![Gravity](gravity.png)

# Getting started with the code

## The gravity function

```
gravity()
```

The gravity() function lets us create a gravity effect that pulls the characters towards the source of the gravity, in this case, it is the bottom of the game screen. When we give characters the body() component, we're giving them a physical body with the ability to react to the gravity in the game. 

```
const player = add([
	sprite("bean"),
	body(),
])
```

We can alter  the acceleration of the gravitational pull by passing the number of pixels we want our character to move per second, into the gravity() function, 

for example 

```
gravity(30)
```
where 30 is the number of pixels a character would accelerate per second, towards the source of gravity. The higher this value is the faster a character would move.

Another fun example would  be to simulate the force of gravity which is 9.82m/s^2 

```
gravity(9.82 **2)
```
However, converting the actual value of the force of gravity to pixels would be a fairly large number and 9.82 would be passed as pixels and our characters would move entirely too slow.

Thus, adding exponent 2 will create a fairly acceptable acceleration rate.


# Things to try

Here are some suggestions to challenge your understanding of the gravity function

- Add other components to your player, try to create a surface for your player to land on. Can you make your player jump after touching the ground?
- Try to reverse the gravity in the game and make your player gravitate upwards


### You can take a look at the repl below

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/Gravity?embed=true"></iframe>
