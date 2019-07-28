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

// Nand2Tetris part 2, practice review 7/27/19

    @R0     // R0 is the control bit for color: 0 = white, -1 = black
    M=0     // initialize R0 to 0

(MAIN_LOOP)
    @KBD
    D=M
    @MAKE_SCREEN_BLACK
    D;JGT
    @MAKE_SCREEN_WHITE
    0;JMP

(MAKE_SCREEN_BLACK)
    @R0
    D=M
    @MAIN_LOOP
    D;JLT   // back to loop if screen already black 
    @R0
    M=-1
    @DRAW
    0;JMP

(MAKE_SCREEN_WHITE)
    @R0
    D=M
    @MAIN_LOOP
    D;JEQ   // back to loop if screen already white
    @R0
    M=0
    @DRAW   // otherwise make screen white
    0;JMP

(DRAW)
    @i
    M=0			// i = 0

    @SCREEN
    D = A
    @address
    M = D		// address = 16384 (base address of the Hack screen)

(DRAW_LOOP)
    @i
    D=M
    @8191
    D=D-A
    @MAIN_LOOP
    D;JGT		// if i > max words return to main loop

    @R0
    D=M         // color control bit
    @address
    A=M		    // writing to memory using a pointer
    M=D		    // RAM[address] = color control bit (16 pixels)
 
    @i
    M=M+1       // i += 1
    @address
    M=M+1	    // address += 1
    @DRAW_LOOP
    0;JMP