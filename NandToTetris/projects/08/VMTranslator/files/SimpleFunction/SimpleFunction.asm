// function SimpleFunction.test 2
(SimpleFunction.test)
     @0
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
     @0
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// push local 0
     @LCL
     D=M
     @0
     A=A+D
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// push local 1
     @LCL
     D=M
     @1
     A=A+D
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// add
     @SP
     AM=M-1
     D=M
     A=A-1
     M=D+M
// not
     @SP
     A=M-1
     M=!M
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
// add
     @SP
     AM=M-1
     D=M
     A=A-1
     M=D+M
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