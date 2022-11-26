kaboom()

const friends = [
	"ka",
	"boom",
	"bean",
	"bag",
	"ghosty",
	"bobo",
	"gigagantrum",
	"note",
	"apple",
	"grass",
	"cloud",
	"sun",
	"moon",
	"love",
	"pineapple",
	"jumpy",
	"portal",
	"watermelon",
	"spike",
	"mark",
	"lightening",
	"egg",
	"coin",
	"btfly",
	"grape",
	"mushroom",
	"meat",
	"steel",
	"key",
	"k",
	"k2",
	"k3",
	"k4",
	"btfly2",
	"btfly3",
	"btfly4",
]

for (const friend of friends) {
	loadSprite(friend, `/sprites/${friend}.png`)
}

add([
	sprite("pack"),
])
