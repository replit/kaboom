uniform float u_radius;
uniform float u_blur;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	if (u_radius <= 0.0) return def_frag();
	vec2 center = u_mouse / u_resolution * vec2(1, -1) + vec2(0, 1);
	float dist = distance(uv * u_resolution, center * u_resolution);
	float alpha = smoothstep(max((dist - u_radius) / u_blur, 0.0), 0.0, 1.0);
	return mix(vec4(0, 0, 0, 1), def_frag(), 1.0 - alpha);
}
