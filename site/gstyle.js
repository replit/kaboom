module.exports = {
	"@font-face": [
		{
			"font-family": "IBM Plex Sans",
			"src": `url("/site/fonts/IBMPlexSans-Regular.ttf") format("truetype")`,
		},
		{
			"font-family": "IBM Plex Mono",
			"src": `url("/site/fonts/IBMPlexMono-Regular.ttf") format("truetype")`,
		},
		{
			"font-family": "Necto Mono",
			"src": `url("/site/fonts/NectoMono-Regular.otf") format("opentype")`,
		},
	],
	"*": {
		"padding": "0",
		"margin": "0",
		"box-sizing": "border-box",
		"font-family": "inherit",
	},
	"html": {
		"width": "100%",
		"height": "100%",
		"font-family": "IBM Plex Sans",
		"color": "#333333",
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
		"> code": {
			"background": "none",
			"border": "none",
			"padding": "none",
			"font-size": "inherit",
		},
	},
	"code": {
		"background": "#fafafa",
		"border": "solid 2px #eaeaea",
		"font-size": "90%",
		"padding": "2px 6px",
		"border-radius": "12px",
		"font-family": "IBM Plex Mono",
	},
	"blockquote": {
		"color": "#999999",
		"padding-left": "24px",
		"border-left": "solid 3px #cccccc",
	},
};
