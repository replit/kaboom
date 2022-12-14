uniform float u_flatness;
uniform float u_scanline_height;
uniform float u_screen_height;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	vec2 center = vec2(0.5, 0.5);
	vec2 off_center = uv - center;
	off_center *= 1.0 + pow(abs(off_center.yx), vec2(u_flatness));
	vec2 uv2 = center + off_center;
	if (uv2.x > 1.0 || uv2.x < 0.0 || uv2.y > 1.0 || uv2.y < 0.0) {
		return vec4(0.0, 0.0, 0.0, 1.0);
	} else {
		vec4 c = vec4(texture2D(tex, uv2).rgb, 1.0);
		float fv = fract(uv2.y * 120.0);
		fv = min(1.0, 0.8 + 0.5 * min(fv, 1.0 - fv));
		c.rgb *= fv;
		return c;
	}
}
