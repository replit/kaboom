(() => {

if (!kaboom) {
	console.error("kaboom not found!");
}

const k = kaboom;

function dyntext(t, size, conf = {}) {

	return {

		_curLen: 0,
		text: t,
		textSize: size,
		_textTimer: 0,
		speed: conf.speed || 0.02,
		font: conf.font || "unscii",

		rush() {
			this._curLen = this.text.length;
		},

		update() {

			if (this._curLen >= this.text.length) {
				return;
			}

			this._textTimer += dt();

			if (this._textTimer >= this.speed) {
				this._textTimer = 0;
				this._curLen++;
			}

		},

		draw() {

			const scene = game.scenes[game.curScene];

			const ftext = fmtText(this.text.substring(0, this._curLen), {
				pos: this.pos,
				scale: this.scale,
				rot: this.angle,
				size: this.textSize,
				origin: this.origin,
				color: this.color,
				font: this.font,
				width: conf.width,
				// TODO: not require game here
				z: scene.layers[this.layer || scene.defLayer],
			});

			this.width = ftext.tw;
			this.height = ftext.th;

			drawFormattedText(ftext);

		},

	};

}

k.dyntext = dyntext;

})();
