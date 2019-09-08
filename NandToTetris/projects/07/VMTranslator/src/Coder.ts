import { MemorySegment, MemorySegmentMap, CommandType, Command } from "./Constants";

export class Coder {
    private lineNumber = 0;
    constructor() {
        this.init();
    }
    public init() {
        this.lineNumber = 0;
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

    private writeAddSubAndOr(directive: string): string {
        this.lineNumber += 5;
        return `@SP
AM=M-1
D=M
A=A-1
M=${directive}`;
    }

    private writeNegNot(directive: string): string {
        this.lineNumber += 3;
        return `@SP
A=M-1
M=${directive}M`;
    }

    private writeEqLtGt(directive: string): string {
        const returnString = `@SP
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
        return `@${index}
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
                return `@SP
AM=M-1
D=M
@${MemorySegmentMap[memorySegment]}
M=D`;
            case CommandType.push:
                this.lineNumber += 6;
                return `@${MemorySegmentMap[memorySegment]}
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
                    return `@${MemorySegmentMap[memorySegment]}
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
                return `@${MemorySegmentMap[memorySegment]}
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
                return `@SP
AM=M-1
D=M
@${5 + Number(index)}
M=D`;
            case CommandType.push:
                this.lineNumber += 6;
                return `@${5 + Number(index)}
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
                return `@SP
AM=M-1
D=M
@${filename}.${index}
M=D`;
            case CommandType.push:
                this.lineNumber += 6;
                return `@${filename}.${index}
D=M
@SP
AM=M+1
A=A-1
M=D`;
        }
    }
}
