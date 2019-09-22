// Bootstrap code
     @256
     D=A
     @SP
     M=D
     @bootstrap$ret.0
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push bootstrap$ret.0
     @LCL
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push LCL
     @ARG
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push ARG
     @THIS
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push THIS
     @THAT
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push THAT
     @SP
     D=M
     @5
     D=D-A
     @0
     D=D-A
     @ARG
     M=D        // ARG[0] = SP - 5 - nArgs
     @SP
     D=M
     @LCL
     M=D        // LCL = SP
     @Sys.init
     0;JMP
(bootstrap$ret.0)
(bootstrapEnd)
     @bootstrapEnd
     0;JMP
// function Main.fibonacci 0
(Main.fibonacci)
// push argument 0
     @ARG
     D=M
     @0
     A=A+D
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// push constant 2
     @2
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// lt
     @SP
     AM=M-1
     D=M
     A=A-1
     D=M-D
     M=0
     @75
     D;JLT
     @78
     0;JMP
     @SP
     A=M-1
     M=-1
// if-goto IF_TRUE
     @SP
     AM=M-1
     D=M
     @Main.fibonacci:IF_TRUE
     D;JNE
// goto IF_FALSE
     @Main.fibonacci:IF_FALSE
     0;JMP
// label IF_TRUE
(Main.fibonacci:IF_TRUE)
// push argument 0
     @ARG
     D=M
     @0
     A=A+D
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// return
     @LCL
     D=M
     @endFrame
     M=D        // endFrame = LCL
     @5
     D=D-A
     A=D
     D=M
     @retAddr
     M=D        // retAddr = *(endFrame – 5)
     @ARG
     D=M
     @R13
     M=D        // R13 = ARG[0]
     @SP
     A=M-1
     D=M
     @ARG
     A=M
     M=D        // *ARG[0] = POP()
     @R13
     D=M
     @SP
     M=D+1      // SP = ARG[0] + 1
     @endFrame
     D=M
     @1
     D=D-A
     A=D
     D=M
     @THAT
     M=D        // THAT = *(endFrame - 1)
     @endFrame
     D=M
     @2
     D=D-A
     A=D
     D=M
     @THIS
     M=D        // THIS = *(endFrame - 2)
     @endFrame
     D=M
     @3
     D=D-A
     A=D
     D=M
     @ARG
     M=D        // ARG = *(endFrame - 3)
     @endFrame
     D=M
     @4
     D=D-A
     A=D
     D=M
     @LCL
     M=D        // LCL = *(endFrame - 4)
     @retAddr
     A=M
     0;JMP      // goto retAddr
// label IF_FALSE
(Main.fibonacci:IF_FALSE)
// push argument 0
     @ARG
     D=M
     @0
     A=A+D
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// push constant 2
     @2
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// sub
     @SP
     AM=M-1
     D=M
     A=A-1
     M=M-D
// call Main.fibonacci 1
     @Main$ret.1
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push Main$ret.1
     @LCL
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push LCL
     @ARG
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push ARG
     @THIS
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push THIS
     @THAT
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push THAT
     @SP
     D=M
     @5
     D=D-A
     @1
     D=D-A
     @ARG
     M=D        // ARG[0] = SP - 5 - nArgs
     @SP
     D=M
     @LCL
     M=D        // LCL = SP
     @Main.fibonacci
     0;JMP
(Main$ret.1)
// push argument 0
     @ARG
     D=M
     @0
     A=A+D
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// push constant 1
     @1
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// sub
     @SP
     AM=M-1
     D=M
     A=A-1
     M=M-D
// call Main.fibonacci 1
     @Main$ret.2
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push Main$ret.2
     @LCL
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push LCL
     @ARG
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push ARG
     @THIS
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push THIS
     @THAT
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push THAT
     @SP
     D=M
     @5
     D=D-A
     @1
     D=D-A
     @ARG
     M=D        // ARG[0] = SP - 5 - nArgs
     @SP
     D=M
     @LCL
     M=D        // LCL = SP
     @Main.fibonacci
     0;JMP
(Main$ret.2)
// add
     @SP
     AM=M-1
     D=M
     A=A-1
     M=D+M
// return
     @LCL
     D=M
     @endFrame
     M=D        // endFrame = LCL
     @5
     D=D-A
     A=D
     D=M
     @retAddr
     M=D        // retAddr = *(endFrame – 5)
     @ARG
     D=M
     @R13
     M=D        // R13 = ARG[0]
     @SP
     A=M-1
     D=M
     @ARG
     A=M
     M=D        // *ARG[0] = POP()
     @R13
     D=M
     @SP
     M=D+1      // SP = ARG[0] + 1
     @endFrame
     D=M
     @1
     D=D-A
     A=D
     D=M
     @THAT
     M=D        // THAT = *(endFrame - 1)
     @endFrame
     D=M
     @2
     D=D-A
     A=D
     D=M
     @THIS
     M=D        // THIS = *(endFrame - 2)
     @endFrame
     D=M
     @3
     D=D-A
     A=D
     D=M
     @ARG
     M=D        // ARG = *(endFrame - 3)
     @endFrame
     D=M
     @4
     D=D-A
     A=D
     D=M
     @LCL
     M=D        // LCL = *(endFrame - 4)
     @retAddr
     A=M
     0;JMP      // goto retAddr
// function Sys.init 0
(Sys.init)
// push constant 4
     @4
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// call Main.fibonacci 1
     @Sys$ret.3
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push Sys$ret.3
     @LCL
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push LCL
     @ARG
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push ARG
     @THIS
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push THIS
     @THAT
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push THAT
     @SP
     D=M
     @5
     D=D-A
     @1
     D=D-A
     @ARG
     M=D        // ARG[0] = SP - 5 - nArgs
     @SP
     D=M
     @LCL
     M=D        // LCL = SP
     @Main.fibonacci
     0;JMP
(Sys$ret.3)
// label WHILE
(Sys.init:WHILE)
// goto WHILE
     @Sys.init:WHILE
     0;JMP