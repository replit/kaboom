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
	const char *str = JS_ToCString(ctx, val);
	if (str) {
		fprintf(f, "%s\n", str);
		JS_FreeCString(ctx, str);
	} else {
		fprintf(f, "failed to dump val\n");
	}
}

void JS_DumpErr(JSContext *ctx) {
	JSValue err = JS_GetException(ctx);
	JS_Dump(ctx, stderr, err);
	JSValue stack = JS_GetPropertyStr(ctx, err, "stack");
	if (!JS_IsUndefined(stack)) {
		JS_Dump(ctx, stderr, stack);
	}
	// TODO: is this necessary?
	JS_FreeValue(ctx, stack);
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
		JS_DumpErr(ctx);
	}
	return res;
}

JSValue JS_EEval(
	JSContext *ctx,
	const char *code,
	size_t code_len,
	const char *fname,
	int flags
) {
	JSValue res = JS_Eval(ctx, code, code_len, fname, flags);
	if (JS_IsException(res)) {
		JS_DumpErr(ctx);
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
