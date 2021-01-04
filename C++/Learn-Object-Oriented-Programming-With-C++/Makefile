CC=g++
SRCS=$(wildcard *.cpp) $(wildcard **/*.cpp)
OBJS=$(patsubst %.cpp, %.o, $(SRCS))
SUBDIRS = . $(shell find . -type d)
SUBDIRSCLEAN=$(addsuffix clean, $(SUBDIRS))
PROGRAM=main

$(PROGRAM): $(OBJS)
	$(CC) -g -o $@ $^

%.o: %.cpp
	$(CC) -g -c -o $@ $<

clean:	$(SUBDIRSCLEAN)

clean_curdir:
	rm -rfv *.o main *~

%clean: %
	$(MAKE) -C $< -f $(PWD)/Makefile clean_curdir