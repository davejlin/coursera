CFLAGS=-ggdb3 -Wall -pedantic -std=gnu99
LINK_TARGET = read-matrix
OBJS =  \
 read-matrix.o \
 rotate.o

REBUILDABLES = $(OBJS) $(LINK_TARGET)

all : $(LINK_TARGET)
	echo All done

clean:
	rm -f *.o

cleanall :
	rm -f $(REBUILDABLES)
	echo Clean done

$(LINK_TARGET) : $(OBJS)
	gcc -o $@ $(CFLAGS) $^

%.o : %.c
	gcc -o $@ -c $(CFLAGS) $<
