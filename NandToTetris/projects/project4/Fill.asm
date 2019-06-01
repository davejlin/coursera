// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

// ****************************************************
// initialize screen parameters
    @256         // 256 rows high
    D=A
    @rows
    M=D

    @32
    D=A
    @cols       // 32 columns wide
    M=D

// ****************************************************

(MAIN)
    @KBD
    D=M

// make screen black if any key is pressed
    @BLACKSCREEN
    D;JGT

// make screen white if no key is pressed
    @WHITESCREEN
    0;JMP

// END (MAIN)

// ****************************************************

(BLACKSCREEN)
    @fillvalue
    M=-1

    @FILL
    0;JMP

// END (BLACKSCREEN)

// ****************************************************

(WHITESCREEN)
    @fillvalue
    M=0

    @FILL
    0;JMP

// END (WHITESCREEN)

// ****************************************************

// fill screen uniformly
(FILL)
    @SCREEN     // SCREEN = 16384 (base address of the Hack screen)
    D = A
    @address    // address = present working address
    M = D

    @i          // row looping variable
    M=-1

    (LOOPROW)       // outer loop: through the 256 rows in the screen
    // advance row
        @i
        M=M+1

    // check row loop condition
        @i
        D=M
        @rows
        D=D-M
        @MAIN
        D;JEQ

        @j          // column looping variable
        M=-1

        (LOOPCOL)       // inner loop: through the 32 columns in each row
        // advance column
            @j
            M=M+1

        // check column loop condition
            @j
            D=M
            @cols
            D=D-M
            @LOOPROW
            D;JEQ

        // apply fill
            @fillvalue
            D=M
            @address
            A=M         // write to memory using a pointer
            M=D

        // update address
            @address
            M=M+1

            @LOOPCOL
            0;JMP

// END (FILL)

// ****************************************************