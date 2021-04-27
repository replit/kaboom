CC := cc

CFLAGS += -Iext
CFLAGS += -ObjC

LDFLAGS += -Lext
LDFLAGS += -lquickjs
LDFLAGS += -framework Cocoa
LDFLAGS += -framework OpenGL
LDFLAGS += -framework AudioToolbox

gloo: gloo.c
	$(CC) $(CFLAGS) $(LDFLAGS) $^ -o $@

.PHONY: run
run: gloo
	cd examples && ./../gloo test.js
