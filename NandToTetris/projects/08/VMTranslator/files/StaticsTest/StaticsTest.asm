// Bootstrap code
     @256
     D=A
     @SP
     M=D
     @bootstrap$return.0
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push bootstrap$return.0
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
(bootstrap$return.0)
(bootstrapEnd)
     @bootstrapEnd
     0;JMP
// function Class1.set 0
(Class1.set)
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
// pop static 0
     @SP
     AM=M-1
     D=M
     @Class1.0
     M=D
// push argument 1
     @ARG
     D=M
     @1
     A=A+D
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// pop static 1
     @SP
     AM=M-1
     D=M
     @Class1.1
     M=D
// push constant 0
     @0
     D=A
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
// function Class1.get 0
(Class1.get)
// push static 0
     @Class1.0
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// push static 1
     @Class1.1
     D=M
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
// function Class2.set 0
(Class2.set)
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
// pop static 0
     @SP
     AM=M-1
     D=M
     @Class2.0
     M=D
// push argument 1
     @ARG
     D=M
     @1
     A=A+D
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// pop static 1
     @SP
     AM=M-1
     D=M
     @Class2.1
     M=D
// push constant 0
     @0
     D=A
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
// function Class2.get 0
(Class2.get)
// push static 0
     @Class2.0
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// push static 1
     @Class2.1
     D=M
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
// push constant 6
     @6
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// push constant 8
     @8
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// call Class1.set 2
     @Sys$return.1
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push Sys$return.1
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
     @2
     D=D-A
     @ARG
     M=D        // ARG[0] = SP - 5 - nArgs
     @SP
     D=M
     @LCL
     M=D        // LCL = SP
     @Class1.set
     0;JMP
(Sys$return.1)
// pop temp 0
     @SP
     AM=M-1
     D=M
     @5
     M=D
// push constant 23
     @23
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// push constant 15
     @15
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// call Class2.set 2
     @Sys$return.2
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push Sys$return.2
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
     @2
     D=D-A
     @ARG
     M=D        // ARG[0] = SP - 5 - nArgs
     @SP
     D=M
     @LCL
     M=D        // LCL = SP
     @Class2.set
     0;JMP
(Sys$return.2)
// pop temp 0
     @SP
     AM=M-1
     D=M
     @5
     M=D
// call Class1.get 0
     @Sys$return.3
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push Sys$return.3
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
     @Class1.get
     0;JMP
(Sys$return.3)
// call Class2.get 0
     @Sys$return.4
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push Sys$return.4
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
     @Class2.get
     0;JMP
(Sys$return.4)
// label WHILE
(Sys.init:WHILE)
// goto WHILE
     @Sys.init:WHILE
     0;JMP