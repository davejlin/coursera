// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

// set n = R0
    @R0
    D=M
    @n
    M=D

// initialize prod = 0
    @prod
    M=0

// initialize v = R1
    @R1
    D=M
    @v
    M=D

// initialize R2 = 0
    @R2
    M=0

// initialize i = 1
    @i
    M=1

// effective multiplication: iterate prod += v for n times

(LOOP)
//  check if i>n, if so, stop
    @i
    D=M
    @n
    D=D-M
    @STOP
    D;JGT

//  prod += v
    @v
    D=M
    @prod
    M=D+M
    
//  i++
    @i
    M=M+1

    @LOOP
    0;JMP

(STOP)
    @prod
    D=M
    @R2
    M=D
    @END
    0;JMP

(END)
    @END
    0;JMP