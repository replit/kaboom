CC := cc

CFLAGS += -Iext
CFLAGS += -ObjC

LDFLAGS += -Lext
LDFLAGS += -lquickjs
LDFLAGS += -framework Cocoa
LDFLAGS += -framework OpenGL

gloo: gloo.c
	$(CC) $(CFLAGS) $(LDFLAGS) $^ -o $@
