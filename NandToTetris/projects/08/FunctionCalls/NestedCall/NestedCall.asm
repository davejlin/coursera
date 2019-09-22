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
// function Sys.init 0
(Sys.init)
// push constant 4000
     @4000	//
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// pop pointer 0
     @SP
     AM=M-1
     D=M
     @THIS
     M=D
// push constant 5000
     @5000
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// pop pointer 1
     @SP
     AM=M-1
     D=M
     @THAT
     M=D
// call Sys.main 0
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
     @0
     D=D-A
     @ARG
     M=D        // ARG[0] = SP - 5 - nArgs
     @SP
     D=M
     @LCL
     M=D        // LCL = SP
     @Sys.main
     0;JMP
(Sys$return.1)
// pop temp 1
     @SP
     AM=M-1
     D=M
     @6
     M=D
// label LOOP
(Sys.init:LOOP)
// goto LOOP
     @Sys.init:LOOP
     0;JMP
// function Sys.main 5
(Sys.main)
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
     @0
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// push constant 4001
     @4001
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// pop pointer 0
     @SP
     AM=M-1
     D=M
     @THIS
     M=D
// push constant 5001
     @5001
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// pop pointer 1
     @SP
     AM=M-1
     D=M
     @THAT
     M=D
// push constant 200
     @200
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// pop local 1
     @LCL
     D=M
     @1
     D=D+A
     @R13
     M=D
     @SP
     AM=M-1
     D=M
     @R13
     A=M
     M=D
// push constant 40
     @40
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// pop local 2
     @LCL
     D=M
     @2
     D=D+A
     @R13
     M=D
     @SP
     AM=M-1
     D=M
     @R13
     A=M
     M=D
// push constant 6
     @6
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// pop local 3
     @LCL
     D=M
     @3
     D=D+A
     @R13
     M=D
     @SP
     AM=M-1
     D=M
     @R13
     A=M
     M=D
// push constant 123
     @123
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// call Sys.add12 1
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
     @1
     D=D-A
     @ARG
     M=D        // ARG[0] = SP - 5 - nArgs
     @SP
     D=M
     @LCL
     M=D        // LCL = SP
     @Sys.add12
     0;JMP
(Sys$return.2)
// pop temp 0
     @SP
     AM=M-1
     D=M
     @5
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
// push local 2
     @LCL
     D=M
     @2
     A=A+D
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// push local 3
     @LCL
     D=M
     @3
     A=A+D
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D
// push local 4
     @LCL
     D=M
     @4
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
// add
     @SP
     AM=M-1
     D=M
     A=A-1
     M=D+M
// add
     @SP
     AM=M-1
     D=M
     A=A-1
     M=D+M
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
// function Sys.add12 0
(Sys.add12)
// push constant 4002
     @4002
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// pop pointer 0
     @SP
     AM=M-1
     D=M
     @THIS
     M=D
// push constant 5002
     @5002
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D
// pop pointer 1
     @SP
     AM=M-1
     D=M
     @THAT
     M=D
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
// push constant 12
     @12
     D=A
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