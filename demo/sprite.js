kaboom();

// load default sprite "bean"
loadBean();

loadShader("invert", null, `
vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	vec4 c = def_frag();
	return vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a);
}
`);

// add to screen
add([
	sprite("bean"),
	pos(80, 40),
	shader("invert")
]);
