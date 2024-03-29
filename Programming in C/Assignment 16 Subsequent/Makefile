CFLAGS=-ggdb3 -Wall -pedantic -std=gnu99
LINK_TARGET = test
OBJS =  \
 test-subseq.o \
 maxSeq.o

REBUILDABLES = $(OBJS) $(LINK_TARGET)

all : $(LINK_TARGET)
	echo All done

clean:
	rm -f *.o

cleanall :
	rm -f $(REBUILDABLES)
	echo Clean done


# There is no required order to the list of rules as they appear in the Makefile.
# Make will build its own dependency tree and only execute each rule only once
# its dependencies' rules have been executed successfully.

# Here is a Rule that uses some built-in Make Macros in its command:
# $@ expands to the rule's target, in this case LINK_TARGET.
# $^ expands to the rule's dependencies, in this case the files specified in OBJS
$(LINK_TARGET) : $(OBJS)
	gcc -o $@ $(CFLAGS) $^

# Here is a Pattern Rule, often used for compile-line.
# It says how to create a file with a .o suffix, given a file with a .c suffix.
# The rule's command uses some built-in Make Macros:
# $@ for the pattern-matched target
# $< for the pattern-matched dependency
%.o : %.c
	gcc -o $@ -c $(CFLAGS) $<

# These are Dependency Rules, which are rules without any command.
# Dependency Rules indicate that if any file to the right of the colon changes,
# the target to the left of the colon should be considered out-of-date.
# The commands for making an out-of-date target up-to-date may be found elsewhere
# (in this case, by the Pattern Rule above).
# Dependency Rules are often used to capture header file dependencies.
# test-subseq.o : maxSeq.o

# Alternatively to manually capturing dependencies, several automated
# dependency generators exist.  Here is one possibility (commented out)...
# %.dep : %.cpp
#   g++ -M $(FLAGS) $< > $@
# include $(OBJS:.o=.dep)