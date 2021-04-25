#include "utils.h"

#include <quickjs.h>
#define SOKOL_GLCORE33
#define SOKOL_NO_ENTRY
#define SOKOL_APP_IMPL
#include <sokol_app.h>

#define NUM_KEYS SAPP_KEYCODE_MENU

JSValue gl_mod(JSContext *ctx);

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
	JSValueConst js_frame;
	JSValueConst js_init;
	btn_state key_states[NUM_KEYS];
} app_ctx_t;

static app_ctx_t app_ctx;

static btn_state process_btn(btn_state b) {
	if (b == BTN_PRESSED || b == BTN_RPRESSED) {
		return BTN_DOWN;
	} else if (b == BTN_RELEASED) {
		return BTN_IDLE;
	}
	return b;
}

static void init() {
	JS_Call(app_ctx.js_ctx, app_ctx.js_init, JS_UNDEFINED, 0, NULL);
}

static void frame() {
	JS_Call(app_ctx.js_ctx, app_ctx.js_frame, JS_UNDEFINED, 0, NULL);
	for (int i = 0; i < NUM_KEYS; i++) {
		app_ctx.key_states[i] = process_btn(app_ctx.key_states[i]);
	}
}

static void event(const sapp_event *ev) {
	switch (ev->type) {
		case SAPP_EVENTTYPE_KEY_DOWN:
			if (ev->key_repeat) {
				app_ctx.key_states[ev->key_code] = BTN_RPRESSED;
			} else {
				app_ctx.key_states[ev->key_code] = BTN_PRESSED;
			}
			break;
		case SAPP_EVENTTYPE_KEY_UP:
// 			app_ctx.key_states[ev->key_code] = BTN_RELEASED;
			break;
		case SAPP_EVENTTYPE_CHAR:
			break;
		case SAPP_EVENTTYPE_MOUSE_DOWN:
			break;
		case SAPP_EVENTTYPE_MOUSE_UP:
			break;
		case SAPP_EVENTTYPE_MOUSE_MOVE:
			break;
		default:
			break;
	}
}

static JSValue app_run(
	JSContext *ctx,
	JSValueConst this,
	int argc,
	JSValueConst *argv
) {

	JSValue conf = argv[0];
	app_ctx.js_init = JS_GetPropertyStr(ctx, conf, "init");
	app_ctx.js_frame = JS_GetPropertyStr(ctx, conf, "frame");
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

	return JS_UNDEFINED;

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
	else if (streq(k, "escape")) return SAPP_KEYCODE_ESCAPE;
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

static JSValue app_key_pressed(
	JSContext *ctx,
	JSValueConst this,
	int argc,
	JSValueConst *argv
) {
	sapp_keycode key = str_to_sapp_keycode(JS_ToCString(ctx, argv[0]));
	btn_state state = app_ctx.key_states[key];
	if (state == BTN_PRESSED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

static JSValue app_key_pressed_rep(
	JSContext *ctx,
	JSValueConst this,
	int argc,
	JSValueConst *argv
) {
	sapp_keycode key = str_to_sapp_keycode(JS_ToCString(ctx, argv[0]));
	btn_state state = app_ctx.key_states[key];
	if (state == BTN_PRESSED || state == BTN_RPRESSED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

static JSValue app_key_down(
	JSContext *ctx,
	JSValueConst this,
	int argc,
	JSValueConst *argv
) {
	sapp_keycode key = str_to_sapp_keycode(JS_ToCString(ctx, argv[0]));
	btn_state state = app_ctx.key_states[key];
	if (state == BTN_PRESSED || state == BTN_RPRESSED || state == BTN_DOWN) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

static JSValue app_key_released(
	JSContext *ctx,
	JSValueConst this,
	int argc,
	JSValueConst *argv
) {
	sapp_keycode key = str_to_sapp_keycode(JS_ToCString(ctx, argv[0]));
	btn_state state = app_ctx.key_states[key];
	if (state == BTN_RELEASED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

static const JSCFunctionListEntry app_fields[] = {
	JS_CFUNC_DEF("run", 0, app_run),
	JS_CFUNC_DEF("keyPressed", 1, app_key_pressed),
	JS_CFUNC_DEF("keyPressedRep", 1, app_key_pressed_rep),
	JS_CFUNC_DEF("keyDown", 1, app_key_down),
	JS_CFUNC_DEF("keyReleased", 1, app_key_released),
};

JSValue app_mod(JSContext *ctx) {
	app_ctx.js_ctx = ctx;
	JSValue app = JS_NewObject(ctx);
	JS_SetPropertyFunctionList(ctx, app, app_fields, countof(app_fields));
	JS_SetPropertyStr(ctx, app, "gl", gl_mod(ctx));
	return app;
}
