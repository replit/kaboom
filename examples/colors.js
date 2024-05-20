kaboom()

loadBean()

let aaa = add([
	sprite("bean"),
	color(WHITE),
	pos(center()),
])

aaa.color = Color.fromArray([100, 100, 100])
debug.log(aaa.color.toArray())