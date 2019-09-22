import os = require("os");
import { MemorySegment, MemorySegmentMap, CommandType, Command } from "./Constants";

export class Coder {
    private lineNumber = 0;
    private returnIndex = 0;

    constructor() {
        this.init();
    }
    public init() {
        this.lineNumber = 0;
        this.returnIndex = 0;
    }

    public writeBootstrap() {
        this.lineNumber += 6;
        return `// Bootstrap code
     @256
     D=A
     @SP
     M=D
${this.writeCall("Sys.init", "0", "bootstrap")}
(bootstrapEnd)
     @bootstrapEnd
     0;JMP`;
    }

    /**
     * Returns the assembly code that implements the given arithmetic command.
     * @param command
     */
    public writeArithmetic(command: string): string {
        switch (command) {
            case Command.add:
                return this.writeAddSubAndOr("D+M");
            case Command.sub:
                return this.writeAddSubAndOr("M-D");
            case Command.and:
                return this.writeAddSubAndOr("M&D");
            case Command.or:
                return this.writeAddSubAndOr("M|D");
            case Command.neg:
                return this.writeNegNot("-");
            case Command.not:
                return this.writeNegNot("!");
            case Command.eq:
                return this.writeEqLtGt("JEQ");
            case Command.lt:
                return this.writeEqLtGt("JLT");
            case Command.gt:
                return this.writeEqLtGt("JGT");
            default:
                return ``;
        }
    }

    /**
     * Returns the assembly code that implements the given push or pop command.
     * @param command
     * @param memorySegment
     * @param index
     */
    public writePushPop(command: string, memorySegment: string, index: string, filename: string): string {
        switch (memorySegment) {
            case MemorySegment.constant:
                return this.writePushConstant(index);
            case MemorySegment.temp:
                return this.writeTemp(command, index);
            case MemorySegment.pointer:
                return this.writePointer(command, index);
            case MemorySegment.static:
                    return this.writeStatic(command, index, filename);
            case MemorySegment.local:
            case MemorySegment.argument:
            case MemorySegment.this:
            case MemorySegment.that:
                return this.writeLocalArgumentThisOrThat(command, memorySegment, index);
        }
    }

    public writeLabel(label: string, functionName: string, openSymbol: string = "(", closeSymbol: string = ")"): string {
        this.lineNumber += 0; // labels definitions are not counted as a line
        const prefix = functionName.length > 0 ? `${functionName}:` : ``;
        return `${openSymbol}${prefix}${label}${closeSymbol}`;
    }

    public writeGoto(label: string, functionName: string): string {
        this.lineNumber += 2;
        return `     @${this.writeLabel(label, functionName, "", "")}
     0;JMP`
    }

    public writeIfGoto(label: string, functionName: string): string {
        this.lineNumber += 6;
        return `     @SP
     AM=M-1
     D=M
     @${this.writeLabel(label, functionName, "", "")}
     D;JNE`
    }

    public writeFunction(functionName: string, index: string) {
        this.lineNumber += 0; // function labels are not counted as a line
        let line = `(${functionName})`;

        let nArgs = Number(index);
        if (nArgs === 0) {
            return line;
        }

        for (let i = 0; i < nArgs; i += 1) {
            line += `${os.EOL}${this.writePushConstant("0")}`;
        }
        return line;
    }

    public writeCall(functionName: string, nArgs: string, filename: string) {
        this.lineNumber += 44;
        const returnAddressLabel = this.getReturnAddressLabel(filename);
        return `     @${returnAddressLabel}
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push ${returnAddressLabel}
     @${MemorySegmentMap[MemorySegment.local]}
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push LCL
     @${MemorySegmentMap[MemorySegment.argument]}
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push ARG
     @${MemorySegmentMap[MemorySegment.this]}
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push THIS
     @${MemorySegmentMap[MemorySegment.that]}
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push THAT
     @SP
     D=M
     @5
     D=D-A
     @${nArgs}
     D=D-A
     @${MemorySegmentMap[MemorySegment.argument]}
     M=D        // ARG[0] = SP - 5 - nArgs
     @SP
     D=M
     @${MemorySegmentMap[MemorySegment.local]}
     M=D        // LCL = SP
     @${functionName}
     0;JMP
(${returnAddressLabel})`;
    }

    public writeReturn(): string {
        this.lineNumber += 27;
        const retAddr = "retAddr";
        const endFrame = "endFrame";

        return `     @${MemorySegmentMap[MemorySegment.local]}
     D=M
     @${endFrame}
     M=D        // endFrame = LCL
     @5
     D=D-A
     A=D
     D=M
     @${retAddr}
     M=D        // retAddr = *(endFrame – 5)
     @${MemorySegmentMap[MemorySegment.argument]}
     D=M
     @R13
     M=D        // R13 = ARG[0]
     @SP
     A=M-1
     D=M
     @${MemorySegmentMap[MemorySegment.argument]}
     A=M
     M=D        // *ARG[0] = POP()
     @R13
     D=M
     @SP
     M=D+1      // SP = ARG[0] + 1
     ${this.writeSetValue(endFrame, MemorySegmentMap[MemorySegment.that], "1", "-")}
     ${this.writeSetValue(endFrame, MemorySegmentMap[MemorySegment.this], "2", "-")}
     ${this.writeSetValue(endFrame, MemorySegmentMap[MemorySegment.argument], "3", "-")}
     ${this.writeSetValue(endFrame, MemorySegmentMap[MemorySegment.local], "4", "-")}
     @${retAddr}
     A=M
     0;JMP      // goto retAddr`;
    }

    private writeSetValue(from: string, to: string, addressOffset: string, operator: string) {
        this.lineNumber += 8;
        return `@${from}
     D=M
     @${addressOffset}
     D=D${operator}A
     A=D
     D=M
     @${to}
     M=D        // ${to} = *(${from} ${operator} ${addressOffset})`
    }

    private writeAddSubAndOr(directive: string): string {
        this.lineNumber += 5;
        return `     @SP
     AM=M-1
     D=M
     A=A-1
     M=${directive}`;
    }

    private writeNegNot(directive: string): string {
        this.lineNumber += 3;
        return `     @SP
     A=M-1
     M=${directive}M`;
    }

    private writeEqLtGt(directive: string): string {
        const returnString = `     @SP
     AM=M-1
     D=M
     A=A-1
     D=M-D
     M=0
     @${this.lineNumber + 10}
     D;${directive}
     @${this.lineNumber + 13}
     0;JMP
     @SP
     A=M-1
     M=-1`;
        this.lineNumber += 13;
        return returnString;
    }

    private writePushConstant(index: string): string {
        this.lineNumber += 6;
        return `     @${index}
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D`;
    }

    private writePointer(command: string, index: string): string {
        return index === "0" ?
            this.writePointerThisOrThat(command, MemorySegment.this) :
            this.writePointerThisOrThat(command, MemorySegment.that);
    }

    private writePointerThisOrThat(command: string, memorySegment: string): string {
        switch (command) {
            case CommandType.pop:
                this.lineNumber += 5;
                return `     @SP
     AM=M-1
     D=M
     @${MemorySegmentMap[memorySegment]}
     M=D`;
            case CommandType.push:
                this.lineNumber += 6;
                return `     @${MemorySegmentMap[memorySegment]}
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D`;
        }
    }

    private writeLocalArgumentThisOrThat(command: string, memorySegment: string, index: string): string {
        switch (command) {
            case CommandType.pop:
                    this.lineNumber += 12;
                    return `     @${MemorySegmentMap[memorySegment]}
     D=M
     @${index}
     D=D+A
     @R13
     M=D
     @SP
     AM=M-1
     D=M
     @R13
     A=M
     M=D`;
            case CommandType.push:
                this.lineNumber += 9;
                return `     @${MemorySegmentMap[memorySegment]}
     D=M
     @${index}
     A=A+D
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D`;
        }
    }

    private writeTemp(command: string, index: string): string {
        switch (command) {
            case CommandType.pop:
                this.lineNumber += 5;
                return `     @SP
     AM=M-1
     D=M
     @${5 + Number(index)}
     M=D`;
            case CommandType.push:
                this.lineNumber += 6;
                return `     @${5 + Number(index)}
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D`;
        }
    }

    private writeStatic(command: string, index: string, filename: string) {
        switch (command) {
            case CommandType.pop:
                this.lineNumber += 5;
                return `     @SP
     AM=M-1
     D=M
     @${filename}.${index}
     M=D`;
            case CommandType.push:
                this.lineNumber += 6;
                return `     @${filename}.${index}
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D`;
        }
    }

    private getReturnAddressLabel(filename: string) {
        return `${filename}$ret.${this.returnIndex++}`
    }
}
