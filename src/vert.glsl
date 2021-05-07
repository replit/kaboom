attribute vec3 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;

varying vec2 v_uv;
varying vec4 v_color;

vec4 def_vert() {
	return vec4(a_pos, 1.0);
}

vec4 vert() {
	return def_vert();
}

void main() {
	vec4 pos = vert();
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = pos;
}
