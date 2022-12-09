// took idea from https://www.shadertoy.com/view/XlsczN

uniform float u_intensity;

vec3 rgb2yiq(vec3 c){
	return vec3(
		(0.299 * c.r + 0.5959 * c.g + 0.2115 * c.b),
		(0.587 * c.r - 0.2746 * c.g - 0.5227 * c.b),
		(0.114 * c.r - 0.3213 * c.g + 0.3112 * c.b)
	);
}

vec3 yiq2rgb(vec3 c){
	return vec3(
		(1.0 * c.r + 1.0 * c.g + 1.0 * c.b),
		(0.956 * c.r - 0.272 * c.g - 1.106 * c.b),
		(0.619 * c.r - 0.647 * c.g + 1.703 * c.b)
	);
}

vec2 circle(float start, float pts, float pt) {
	float rad = (3.14159 * 2.0 * (1.0 / pts)) * (pt + start);
	return vec2(-(0.3 + rad), cos(rad));
}

vec3 blur(sampler2D samp, vec2 uv, float d) {

	float start = 2.0 / 14.0;
	vec2 scale = vec2(d) * 0.0001;

	vec3 n0 = texture2D(samp, uv + circle(start, 14.0, 0.0) * scale).rgb;
	vec3 n1 = texture2D(samp, uv + circle(start, 14.0, 1.0) * scale).rgb;
	vec3 n2 = texture2D(samp, uv + circle(start, 14.0, 2.0) * scale).rgb;
	vec3 n3 = texture2D(samp, uv + circle(start, 14.0, 3.0) * scale).rgb;
	vec3 n4 = texture2D(samp, uv + circle(start, 14.0, 4.0) * scale).rgb;
	vec3 n5 = texture2D(samp, uv + circle(start, 14.0, 5.0) * scale).rgb;
	vec3 n6 = texture2D(samp, uv + circle(start, 14.0, 6.0) * scale).rgb;
	vec3 n7 = texture2D(samp, uv + circle(start, 14.0, 7.0) * scale).rgb;
	vec3 n8 = texture2D(samp, uv + circle(start, 14.0, 8.0) * scale).rgb;
	vec3 n9 = texture2D(samp, uv + circle(start, 14.0, 9.0) * scale).rgb;
	vec3 n10 = texture2D(samp, uv + circle(start, 14.0, 10.0) * scale).rgb;
	vec3 n11 = texture2D(samp, uv + circle(start, 14.0, 11.0) * scale).rgb;
	vec3 n12 = texture2D(samp, uv + circle(start, 14.0, 12.0) * scale).rgb;
	vec3 n13 = texture2D(samp, uv + circle(start, 14.0, 13.0) * scale).rgb;
	vec3 n14 = texture2D(samp, uv).rgb;

	vec4 clr = texture2D(samp, uv);
	float w = 1.0 / 15.0;

	clr.rgb=
		(n0 * w) +
		(n1 * w) +
		(n2 * w) +
		(n3 * w) +
		(n4 * w) +
		(n5 * w) +
		(n6 * w) +
		(n7 * w) +
		(n8 * w) +
		(n9 * w) +
		(n10 * w) +
		(n11 * w) +
		(n12 * w) +
		(n13 * w) +
		(n14 * w);

	return vec3(clr.xyz);

}

vec4 frag(vec2 pos, vec2 uv, vec4 cc, sampler2D tex) {

	vec4 color = def_frag();
	float c = u_intensity;

	color.xyz = blur(u_tex, v_uv, c);
	float y = rgb2yiq(color.xyz).r;

	c *= 2.0;

	color.xyz = blur(u_tex, v_uv, c);
	float i = rgb2yiq(color.xyz).g;

	c *= 1.5;

	color.xyz = blur(u_tex, v_uv, c);
	float q = rgb2yiq(color.xyz).b;

	color.xyz = yiq2rgb(vec3(y, i, q));

	return color;

}
