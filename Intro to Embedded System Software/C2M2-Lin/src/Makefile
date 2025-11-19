#******************************************************************************
# Copyright (C) 2017 by Alex Fosdick - University of Colorado
#
# Redistribution, modification or use of this software in source or binary
# forms is permitted as long as the files maintain this copyright. Users are 
# permitted to modify this and use it to learn about the field of embedded
# software. Alex Fosdick and the University of Colorado are not liable for any
# misuse of this material. 
#
#*****************************************************************************

#------------------------------------------------------------------------------
# Introduction to Embedded Systems Software and Development Environments
# Assignment for Module 2
# Support build for native and cross compilation
#
# David Lin, May 21, 2023
#
# Use: make [TARGET] [PLATFORM-OVERRIDES]
#
# Build Targets:
#		.asm  		Generate assembly output of c-program implementation files and the 
#			  		final output executable.
# 		.i    		Generate the preprocessed output of all c-program implementation files.
#		.o 	  		Generate the object file for all c-source files (but do not link) by 
#			  		specifying the object file you want to compile.
#		compile-all	Compile all object files, but DO NOT link.
#		build		Compile all object files and link into a final executable.
#		clean		This should remove all compiled objects, preprocessed outputs, assembly 
#					outputs, executable files and build output files.
#
# Platform Overrides:
#      	HOST		Platform default
#		MSP342		Platform cross-compiled
#
#------------------------------------------------------------------------------
include sources.mk

# Platform Overrides
PLATFORM = HOST

# General flags
GEN_FLAGS = -Wall \
	        -Werror \
	        -g \
			-O0 \
	    	-std=c99

# Target
TARGET = c1m2

# Architectures Specific Flags
LINKER_FILE = ../msp432p401r.lds 
CPU = cortex-m4
ARCH = thumb
SPECS = nosys.specs

# Compiler Flags and Defines
LD = arm-none-eabi-ld

ifeq ($(PLATFORM),HOST)
	CC = gcc $(GENFLAGS)
	CFLAGS = -D$(PLATFORM)
	LDFLAGS = -Wl,-Map=$(TARGET).map 
	SIZE = size
endif

ifeq ($(PLATFORM),MSP432)
   	CC = arm-none-eabi-gcc $(GENFLAGS)
	CFLAGS = -D$(PLATFORM) -mcpu=$(CPU) -m$(ARCH) -march=armv7e-m -mfloat-abi=hard -mfpu=fpv4-sp-d16 --specs=$(SPECS)
	LDFLAGS = -T $(LINKER_FILE) -Wl,-Map=$(TARGET).map 
	SIZE = arm-none-eabi-size
endif

OBJS = $(SOURCES:.c=.o)
MAPS = $(SOURCES:.C=.map)
OUTS = $(SOURCES:.C=.out)
ASMS = $(SOURCES:.c=.asm)
DEPNS = $(SOURCES:.c=.d)                          

%.o : %.c
	$(CC) $(INCLUDES) -c $< $(CFLAGS) -o $@

%.i : %.c
	$(CC) -E $< $(INCLUDES) $(CFLAGS)

%.d: %.c
	@set -e; rm -f $@; \
	$(CC) $(INCLUDES) -MM $(CFLAGS) $< > $@.$$$$; \
	sed 's,\($*\)\.o[ :]*,\1.o $@ : ,g' < $@.$$$$ > $@; \
	rm -f $@.$$$$

%.asm : %.c
	$(CC) -S $< $(INCLUDES) $(CFLAGS)


.PHONY: build
build: all

.PHONY: all
all: $(TARGET).out $(DEPNS)

$(TARGET).out: $(OBJS)
	$(CC) $(INCLUDES) $(OBJS) $(CFLAGS)  $(LDFLAGS) -o $@
	$(SIZE) -Atd $(OBJS) $(TARGET).out

$(DEPNS): $(SOURCES)
	@set -e; rm -f $@; \
	$(CC) $(INCLUDES) -MM $(CFLAGS) $< > $@.$$$$; \
	sed 's,\($*\)\.o[ :]*,\1.o $@ : ,g' < $@.$$$$ > $@; \
	rm -f $@.$$$$


.PHONY: compile-all
compile-all:
	$(CC) $(INCLUDES) -c $(SOURCES) $(CFLAGS)


.PHONY: clean
clean:
	rm -f *.asm *.o *.d *.map *.out *.i *.size
