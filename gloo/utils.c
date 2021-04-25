#include <quickjs.h>
#include <stdlib.h>
#include <stdbool.h>

char *read_file(const char *path) {

	FILE *file = fopen(path, "r");

	if (!file) {
		fprintf(stderr, "failed to read: '%s'\n", path);
		return NULL;
	}

	fseek(file, 0, SEEK_END);
	size_t size = ftell(file);
	fseek(file, 0, SEEK_SET);

	char *buffer = malloc(size + 1);
	size_t r_size = fread(buffer, 1, size, file);

	buffer[size] = '\0';

	if (r_size != size) {
		free(buffer);
		fprintf(stderr, "failed to read: '%s'\n", path);
		return NULL;
	}

	fclose(file);

	return buffer;

}

static void JS_Dump(JSContext *ctx, FILE *f, JSValue val) {
	const char *msg = JS_ToCString(ctx, val);
	if (msg) {
		fprintf(stderr, "%s\n", msg);
		JS_FreeCString(ctx, msg);
	} else {
		fprintf(stderr, "failed to dump val\n");
	}
}

JSValue JS_ECall(
	JSContext *ctx,
	JSValue func,
	JSValue this,
	int nargs,
	JSValueConst *argv
) {

	JSValue res = JS_Call(ctx, func, this, nargs, argv);

	if (JS_IsException(res)) {
		JSValue err = JS_GetException(ctx);
		JS_Dump(ctx, stderr, err);
		JSValue stack = JS_GetPropertyStr(ctx, err, "stack");
		if (!JS_IsUndefined(stack)) {
			JS_Dump(ctx, stderr, stack);
		}
		JS_FreeValue(ctx, stack);
	}

	return res;

}

bool JS_CheckNargs(
	JSContext *ctx,
	int expected,
	int actual
) {
	if (expected != actual) {
		JS_ThrowTypeError(ctx, "expected %d args, found %d", expected, actual);
		return false;
	}
	return true;
}
