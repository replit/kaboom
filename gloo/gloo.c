#include "utils.h"

#include <quickjs.h>
#define SOKOL_GLCORE33
#define SOKOL_NO_ENTRY
#define SOKOL_APP_IMPL
#include <sokol_app.h>
#include <sys/time.h>

// TODO
#define NUM_KEYS SAPP_KEYCODE_MENU

JSValue gl_get(JSContext *ctx);

typedef enum {
	BTN_IDLE,
	BTN_PRESSED,
	BTN_RPRESSED,
	BTN_RELEASED,
	BTN_DOWN,
} btn_state;

typedef struct {
	// TODO: not great
	JSContext *js_ctx;
	JSValue js_frame;
	JSValue js_init;
	JSValue g;
	btn_state key_states[NUM_KEYS];
	btn_state mouse_state;
	struct timeval start_time;
	float time;
	float dt;
	float mouse_x;
	float mouse_y;
} gctx_t;

static gctx_t gctx;

static btn_state process_btn(btn_state b) {
	if (b == BTN_PRESSED || b == BTN_RPRESSED) {
		return BTN_DOWN;
	} else if (b == BTN_RELEASED) {
		return BTN_IDLE;
	}
	return b;
}

static void init() {
	gettimeofday(&gctx.start_time, NULL);
	JS_ECall(gctx.js_ctx, gctx.js_init, JS_UNDEFINED, 1, &gctx.g);
}

static void frame() {

	JS_ECall(gctx.js_ctx, gctx.js_frame, JS_UNDEFINED, 1, &gctx.g);

	struct timeval time;

	gettimeofday(&time, NULL);

	float t =
		(float)(time.tv_sec - gctx.start_time.tv_sec)
		+ (float)(time.tv_usec - gctx.start_time.tv_usec) / 1000000.0;
	gctx.dt = t - gctx.time;
	gctx.time = t;

	for (int i = 0; i < NUM_KEYS; i++) {
		gctx.key_states[i] = process_btn(gctx.key_states[i]);
	}

	gctx.mouse_state = process_btn(gctx.mouse_state);

}

static void event(const sapp_event *ev) {
	switch (ev->type) {
		case SAPP_EVENTTYPE_KEY_DOWN:
			if (ev->key_repeat) {
				gctx.key_states[ev->key_code] = BTN_RPRESSED;
			} else {
				gctx.key_states[ev->key_code] = BTN_PRESSED;
			}
			break;
		case SAPP_EVENTTYPE_KEY_UP:
			gctx.key_states[ev->key_code] = BTN_RELEASED;
			break;
		case SAPP_EVENTTYPE_CHAR:
			break;
		case SAPP_EVENTTYPE_MOUSE_DOWN:
			if (ev->mouse_button == SAPP_MOUSEBUTTON_LEFT) {
				gctx.mouse_state = BTN_PRESSED;
			}
			break;
		case SAPP_EVENTTYPE_MOUSE_UP:
			if (ev->mouse_button == SAPP_MOUSEBUTTON_LEFT) {
				gctx.mouse_state = BTN_RELEASED;
			}
			break;
		case SAPP_EVENTTYPE_MOUSE_MOVE:
			gctx.mouse_x = ev->mouse_x;
			gctx.mouse_y = ev->mouse_y;
			break;
		default:
			break;
	}
}

bool streq(const char *s1, const char *s2) {
	return strcmp(s1, s2) == 0;
}

static sapp_keycode str_to_sapp_keycode(const char *k) {
	if      (streq(k, "a")) return SAPP_KEYCODE_A;
	else if (streq(k, "b")) return SAPP_KEYCODE_B;
	else if (streq(k, "c")) return SAPP_KEYCODE_C;
	else if (streq(k, "d")) return SAPP_KEYCODE_D;
	else if (streq(k, "e")) return SAPP_KEYCODE_E;
	else if (streq(k, "f")) return SAPP_KEYCODE_F;
	else if (streq(k, "g")) return SAPP_KEYCODE_G;
	else if (streq(k, "h")) return SAPP_KEYCODE_H;
	else if (streq(k, "i")) return SAPP_KEYCODE_I;
	else if (streq(k, "j")) return SAPP_KEYCODE_J;
	else if (streq(k, "k")) return SAPP_KEYCODE_K;
	else if (streq(k, "l")) return SAPP_KEYCODE_L;
	else if (streq(k, "m")) return SAPP_KEYCODE_M;
	else if (streq(k, "n")) return SAPP_KEYCODE_N;
	else if (streq(k, "o")) return SAPP_KEYCODE_O;
	else if (streq(k, "p")) return SAPP_KEYCODE_P;
	else if (streq(k, "q")) return SAPP_KEYCODE_Q;
	else if (streq(k, "r")) return SAPP_KEYCODE_R;
	else if (streq(k, "s")) return SAPP_KEYCODE_S;
	else if (streq(k, "t")) return SAPP_KEYCODE_T;
	else if (streq(k, "u")) return SAPP_KEYCODE_U;
	else if (streq(k, "v")) return SAPP_KEYCODE_V;
	else if (streq(k, "w")) return SAPP_KEYCODE_W;
	else if (streq(k, "x")) return SAPP_KEYCODE_X;
	else if (streq(k, "y")) return SAPP_KEYCODE_Y;
	else if (streq(k, "z")) return SAPP_KEYCODE_Z;
	else if (streq(k, "1")) return SAPP_KEYCODE_1;
	else if (streq(k, "2")) return SAPP_KEYCODE_2;
	else if (streq(k, "3")) return SAPP_KEYCODE_3;
	else if (streq(k, "4")) return SAPP_KEYCODE_4;
	else if (streq(k, "5")) return SAPP_KEYCODE_5;
	else if (streq(k, "6")) return SAPP_KEYCODE_6;
	else if (streq(k, "7")) return SAPP_KEYCODE_7;
	else if (streq(k, "8")) return SAPP_KEYCODE_8;
	else if (streq(k, "9")) return SAPP_KEYCODE_9;
	else if (streq(k, "0")) return SAPP_KEYCODE_0;
	else if (streq(k, "-")) return SAPP_KEYCODE_MINUS;
	else if (streq(k, "=")) return SAPP_KEYCODE_EQUAL;
	else if (streq(k, "space")) return SAPP_KEYCODE_SPACE;
	else if (streq(k, ",")) return SAPP_KEYCODE_COMMA;
	else if (streq(k, ".")) return SAPP_KEYCODE_PERIOD;
	else if (streq(k, "/")) return SAPP_KEYCODE_SLASH;
	else if (streq(k, "[")) return SAPP_KEYCODE_LEFT_BRACKET;
	else if (streq(k, "]")) return SAPP_KEYCODE_RIGHT_BRACKET;
	else if (streq(k, "\\")) return SAPP_KEYCODE_BACKSLASH;
	else if (streq(k, ";")) return SAPP_KEYCODE_SEMICOLON;
	else if (streq(k, "enter")) return SAPP_KEYCODE_ENTER;
	else if (streq(k, "esc")) return SAPP_KEYCODE_ESCAPE;
	else if (streq(k, "backspace")) return SAPP_KEYCODE_BACKSPACE;
	else if (streq(k, "tab")) return SAPP_KEYCODE_TAB;
// 	else if (streq(k, "'")) return SAPP_KEYCODE_QUOTE;
	else if (streq(k, "`")) return SAPP_KEYCODE_GRAVE_ACCENT;
	else if (streq(k, "f1")) return SAPP_KEYCODE_F1;
	else if (streq(k, "f2")) return SAPP_KEYCODE_F2;
	else if (streq(k, "f3")) return SAPP_KEYCODE_F3;
	else if (streq(k, "f4")) return SAPP_KEYCODE_F4;
	else if (streq(k, "f5")) return SAPP_KEYCODE_F5;
	else if (streq(k, "f6")) return SAPP_KEYCODE_F6;
	else if (streq(k, "f7")) return SAPP_KEYCODE_F7;
	else if (streq(k, "f5")) return SAPP_KEYCODE_F5;
	else if (streq(k, "f6")) return SAPP_KEYCODE_F6;
	else if (streq(k, "f7")) return SAPP_KEYCODE_F7;
	else if (streq(k, "f8")) return SAPP_KEYCODE_F8;
	else if (streq(k, "f9")) return SAPP_KEYCODE_F9;
	else if (streq(k, "f10")) return SAPP_KEYCODE_F10;
	else if (streq(k, "f11")) return SAPP_KEYCODE_F11;
	else if (streq(k, "f12")) return SAPP_KEYCODE_F12;
	else if (streq(k, "right")) return SAPP_KEYCODE_RIGHT;
	else if (streq(k, "left")) return SAPP_KEYCODE_LEFT;
	else if (streq(k, "down")) return SAPP_KEYCODE_DOWN;
	else if (streq(k, "up")) return SAPP_KEYCODE_UP;
	else if (streq(k, "control")) return SAPP_KEYCODE_RIGHT_CONTROL;
	else return SAPP_KEYCODE_INVALID;
}

static JSValue gloo_key_pressed(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	const char *key = JS_ToCString(ctx, argv[0]);
	btn_state state = gctx.key_states[str_to_sapp_keycode(key)];
	JS_FreeCString(ctx, key);
	if (state == BTN_PRESSED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

static JSValue gloo_key_pressed_rep(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	const char *key = JS_ToCString(ctx, argv[0]);
	btn_state state = gctx.key_states[str_to_sapp_keycode(key)];
	JS_FreeCString(ctx, key);
	if (state == BTN_PRESSED || state == BTN_RPRESSED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

static JSValue gloo_key_down(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	const char *key = JS_ToCString(ctx, argv[0]);
	btn_state state = gctx.key_states[str_to_sapp_keycode(key)];
	JS_FreeCString(ctx, key);
	if (state == BTN_PRESSED || state == BTN_RPRESSED || state == BTN_DOWN) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

static JSValue gloo_key_released(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	const char *key = JS_ToCString(ctx, argv[0]);
	btn_state state = gctx.key_states[str_to_sapp_keycode(key)];
	JS_FreeCString(ctx, key);
	if (state == BTN_RELEASED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

static JSValue gloo_mouse_pressed(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	if (gctx.mouse_state == BTN_PRESSED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

static JSValue gloo_mouse_down(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	if (gctx.mouse_state == BTN_PRESSED || gctx.mouse_state == BTN_DOWN) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

static JSValue gloo_mouse_released(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	if (gctx.mouse_state == BTN_RELEASED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

static JSValue gloo_time(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewFloat64(ctx, gctx.time);
}

static JSValue gloo_dt(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewFloat64(ctx, gctx.dt);
}

static JSValue gloo_mouse_x(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewFloat64(ctx, gctx.mouse_x);
}

static JSValue gloo_mouse_y(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewFloat64(ctx, gctx.mouse_y);
}

static JSValue gloo_width(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewInt32(ctx, sapp_width());
}

static JSValue gloo_height(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewInt32(ctx, sapp_height());
}

static JSValue gloo_quit(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	sapp_quit();
	return JS_UNDEFINED;
}

static const JSCFunctionListEntry gloo_fields[] = {
	JS_CFUNC_DEF("quit", 0, gloo_quit),
	JS_CFUNC_DEF("time", 0, gloo_time),
	JS_CFUNC_DEF("dt", 0, gloo_dt),
	JS_CFUNC_DEF("mouseX", 0, gloo_mouse_x),
	JS_CFUNC_DEF("mouseY", 0, gloo_mouse_y),
	JS_CFUNC_DEF("width", 0, gloo_width),
	JS_CFUNC_DEF("height", 0, gloo_height),
	JS_CFUNC_DEF("keyPressed", 1, gloo_key_pressed),
	JS_CFUNC_DEF("keyPressedRep", 1, gloo_key_pressed_rep),
	JS_CFUNC_DEF("keyDown", 1, gloo_key_down),
	JS_CFUNC_DEF("keyReleased", 1, gloo_key_released),
	JS_CFUNC_DEF("mousePressed", 0, gloo_mouse_pressed),
	JS_CFUNC_DEF("mouseDown", 0, gloo_mouse_down),
	JS_CFUNC_DEF("mouseReleased", 0, gloo_mouse_released),
};

JSValue gloo(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {

	gctx.js_ctx = ctx;

	gctx.g = JS_NewObject(ctx);

	JS_SetPropertyStr(ctx, gctx.g, "gl", gl_get(ctx));
	JS_SetPropertyFunctionList(ctx, gctx.g, gloo_fields, countof(gloo_fields));

	JSValue conf = argv[0];
	gctx.js_init = JS_GetPropertyStr(ctx, conf, "init");
	gctx.js_frame = JS_GetPropertyStr(ctx, conf, "frame");
	const char *title = JS_ToCString(ctx, JS_GetPropertyStr(ctx, conf, "title"));
	int width, height;
	JS_ToInt32(ctx, &width, JS_GetPropertyStr(ctx, conf, "width"));
	JS_ToInt32(ctx, &height, JS_GetPropertyStr(ctx, conf, "height"));

	// TODO: sometimes over 10sec delay on creating OpenGL context on Macbook M1
	// / Big Sur, no idea why
	sapp_run(&(sapp_desc) {
		.width = width,
		.height = height,
		.window_title = title,
		.init_cb = init,
		.frame_cb = frame,
		.event_cb = event,
	});

	JS_FreeCString(ctx, title);

	return gctx.g;

}

void gloo_init(JSContext *ctx) {
	JSValue gobj = JS_GetGlobalObject(ctx);
	JS_SetPropertyStr(ctx, gobj, "gloo", JS_NewCFunction(ctx, gloo, "gloo", 1));
}
