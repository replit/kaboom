precision mediump float;

varying vec2 v_uv;
varying vec4 v_color;

uniform sampler2D u_tex;

void main() {
	gl_FragColor = v_color * texture2D(u_tex, v_uv);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
