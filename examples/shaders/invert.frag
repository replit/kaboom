uniform float u_invert;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	vec4 c = def_frag();
	return mix(c, vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a), u_invert);
}
