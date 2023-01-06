export const GAMEPAD_MAPS = {
	// Generic gamepads
	"Generic   USB  Joystick   (Vendor: 0079 Product: 0006)": {
		buttons: {
			"0": "north",
			"1": "east",
			"2": "south",
			"3": "west",
			"4": "ltrigger",
			"5": "rtrigger",
			"6": "lshoulder",
			"7": "rshoulder",
			"8": "select",
			"9": "start",
			"10": "lstick",
			"11": "rstick",
		},
		sticks: {
			"left": { x: 0, y: 1 },
			"right": { x: 2, y: 5 },
		},
	},

	// Nintendo Switch JoyCon L+R
	"Joy-Con L+R (STANDARD GAMEPAD Vendor: 057e Product: 200e)": {
		buttons: {
			"0": "south",
			"1": "east",
			"2": "north",
			"3": "west",
			"4": "ltrigger",
			"5": "rtrigger",
			"6": "lshoulder",
			"7": "rshoulder",
			"8": "select",
			"9": "start",
			"10": "lstick",
			"11": "rstick",
			"12": "dpad-south",
			"13": "dpad-east",
			"14": "dpad-north",
			"15": "dpad-west",
		},
		sticks: {
			"left": { x: 0, y: 1 },
			"right": { x: 2, y: 5 },
		},
	},

	// if the gamepad isn't recognized
	"default": {
		buttons: {
			"0": "north",
			"1": "east",
			"2": "south",
			"3": "west",
			"4": "ltrigger",
			"5": "rtrigger",
			"6": "lshoulder",
			"7": "rshoulder",
			"8": "select",
			"9": "start",
			"10": "lstick",
			"11": "rstick",
		},
		sticks: {
			"left": { x: 0, y: 1 },
			"right": { x: 2, y: 5 },
		},
	},
}