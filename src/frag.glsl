precision mediump float;

varying vec2 v_uv;
varying vec4 v_color;

uniform sampler2D u_tex;

vec4 def_frag() {
	return v_color * texture2D(u_tex, v_uv);
}

vec4 frag() {
	return def_frag();
}

void main() {
	vec4 color = frag();
	gl_FragColor = color;
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
