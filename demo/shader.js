// Custom shader
kaboom();

loadSprite("bean", "/sprites/bean.png")

// Load a shader with custom fragment shader code
// The fragment shader should define a function "frag", which returns a color and receives the vertex position, texture coodinate, vertex color, and texture as arguments
// There's also the def_frag() function which returns the default fragment color
loadShader("invert", null, `
vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	vec4 c = def_frag();
	return vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a);
}
`)

add([
	sprite("bean"),
	pos(80, 40),
	scale(8),
	// Use the shader with shader() component
	shader("invert"),
])
