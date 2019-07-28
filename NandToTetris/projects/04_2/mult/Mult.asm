// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

// Nand2Tetris part 2, practice review 7/27/19

    @R2
    M=0     // initialize RAM[2] to zero

    @i
    M=1     // i = 1

    @prod
    M=0     // prod = 0

// effective multiplication: 
// keep adding R1 to prod for R0 times

(LOOP)
    @i
    D=M
    @R0
    D=D-M
    @STOP
    D;JGT   // if i > R0 goto STOP

    @prod
    D=M
    @R1
    D=D+M
    @prod
    M=D     // prod += R1

    @i
    M=M+1   // increment i
    @LOOP
    0;JMP

(STOP)
    @prod
    D=M
    @R2
    M=D     // RAM[2] = prod

(END)
    @END
    0;JMP
