uniform float u_radius;
uniform float u_blur;
uniform vec2 u_resolution;

vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	if (u_radius <= 0.0) {
		return def_frag();
	}
	vec2 center = vec2(0.5, 0.5);
	float dist = distance(uv * u_resolution, center * u_resolution);
	if (dist >= u_radius) {
		float alpha = smoothstep((dist - u_radius) / u_blur, 0.0, 1.0);
		return mix(vec4(0, 0, 0, 1), def_frag(), 1.0 - alpha);
	} else {
		return def_frag();
	}
}
