// TALK: Everything starts with the `kaboom()` function
// TALK: It tells the browser "we're going to make a kaboom game!"
// TALK: If the browser is nice they'll give us a blank canvas!
// TALK: We pass in a `'global'` flag to import all kaboom functions to global namespace
// TALK: So we can use all the kaboom functions without any prefix
// TALK: But a blank canvas is boring, let's draw something on it

kaboom({
	global: true,
});
