CFLAGS=-Wall -Werror -std=gnu99 -pedantic -ggdb3
OBJS=kv_test.o input.o kv.o
PROGRAM=kv_test

$(PROGRAM): $(OBJS)
	gcc $(CFLAGS) -o $@ $(OBJS)

%.o: %.c input.h kv.h
	gcc -c $(CFLAGS) $<

clean:
	rm -f $(OBJS) $(PROGRAM) *~