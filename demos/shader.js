// custom shader component
kaboom({
	scale: 2,
});

loadRoot("/pub/examples/");
loadSprite("mark", "img/mark.png");
loadShader("test", null, `
uniform float u_time;
uniform vec2 u_mpos;

vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	vec2 pp = uv - u_mpos;
	float angle = atan(pp.y, pp.x);
	float dis = length(pp);
	float c = sin(dis * 48.0 + u_time * 8.0 + angle);
	return vec4(c, c, c, 1);
}
`);

add([
	rect(width(), height()),
	shader("test"),
	{
		update() {
			this.uniform["u_time"] = time();
			this.uniform["u_mpos"] = mousePos().scale(1 / width(), 1 / height());
		},
	}
]);
