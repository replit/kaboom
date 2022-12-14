uniform float u_size;
uniform vec2 u_resolution;

// TODO: this is causing some extra pixels to appear at screen edge
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	if (u_size <= 0.0) return def_frag();
	vec2 nsize = vec2(u_size / u_resolution.x, u_size / u_resolution.y);
	float x = floor(uv.x / nsize.x + 0.5);
	float y = floor(uv.y / nsize.y + 0.5);
	vec4 c = texture2D(tex, vec2(x, y) * nsize);
	return c * color;
}
