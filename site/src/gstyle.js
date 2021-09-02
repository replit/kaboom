module.exports = {
	"@font-face": [
		{
			"font-family": "IBM Plex Sans",
			"src": `url("/fonts/IBMPlexSans-Regular.ttf") format("truetype")`,
		},
		{
			"font-family": "IBM Plex Mono",
			"src": `url("/fonts/IBMPlexMono-Regular.ttf") format("truetype")`,
		},
	],
	"*": {
		"padding": "0",
		"margin": "0",
		"box-sizing": "border-box",
		"font-family": "inherit",
		"color": "#333333",
	},
	"html": {
		"width": "100%",
		"height": "100%",
		"font-family": "IBM Plex Sans",
	},
	"body": {
		"width": "100%",
		"height": "100%",
	},
	"pre": {
		"overflow": "scroll",
		"font-family": "IBM Plex Mono",
		"background": "#fafafa",
		"padding": "16px",
		"border": "solid 2px #eaeaea",
		"border-radius": "12px",
	},
	"code": {
		"font-family": "IBM Plex Mono",
	},
};
