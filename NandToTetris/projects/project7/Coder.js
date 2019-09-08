"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
class Coder {
    constructor() {
        this.lineNumber = 0;
        this.init();
    }
    init() {
        this.lineNumber = 0;
    }
    /**
     * Returns the assembly code that implements the given arithmetic command.
     * @param command
     */
    writeArithmetic(command) {
        switch (command) {
            case Constants_1.Command.add:
                return this.writeAddSubAndOr("D+M");
            case Constants_1.Command.sub:
                return this.writeAddSubAndOr("M-D");
            case Constants_1.Command.and:
                return this.writeAddSubAndOr("M&D");
            case Constants_1.Command.or:
                return this.writeAddSubAndOr("M|D");
            case Constants_1.Command.neg:
                return this.writeNegNot("-");
            case Constants_1.Command.not:
                return this.writeNegNot("!");
            case Constants_1.Command.eq:
                return this.writeEqLtGt("JEQ");
            case Constants_1.Command.lt:
                return this.writeEqLtGt("JLT");
            case Constants_1.Command.gt:
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
    writePushPop(command, memorySegment, index, filename) {
        switch (memorySegment) {
            case Constants_1.MemorySegment.constant:
                return this.writePushConstant(index);
            case Constants_1.MemorySegment.temp:
                return this.writeTemp(command, index);
            case Constants_1.MemorySegment.pointer:
                return this.writePointer(command, index);
            case Constants_1.MemorySegment.static:
                return this.writeStatic(command, index, filename);
            case Constants_1.MemorySegment.local:
            case Constants_1.MemorySegment.argument:
            case Constants_1.MemorySegment.this:
            case Constants_1.MemorySegment.that:
                return this.writeLocalArgumentThisOrThat(command, memorySegment, index);
        }
    }
    writeAddSubAndOr(directive) {
        this.lineNumber += 5;
        return `@SP
AM=M-1
D=M
A=A-1
M=${directive}`;
    }
    writeNegNot(directive) {
        this.lineNumber += 3;
        return `@SP
A=M-1
M=${directive}M`;
    }
    writeEqLtGt(directive) {
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
    writePushConstant(index) {
        this.lineNumber += 6;
        return `@${index}
D=A
@SP
AM=M+1
A=A-1
M=D`;
    }
    writePointer(command, index) {
        return index === "0" ?
            this.writePointerThisOrThat(command, Constants_1.MemorySegment.this) :
            this.writePointerThisOrThat(command, Constants_1.MemorySegment.that);
    }
    writePointerThisOrThat(command, memorySegment) {
        switch (command) {
            case Constants_1.CommandType.pop:
                this.lineNumber += 5;
                return `@SP
AM=M-1
D=M
@${Constants_1.MemorySegmentMap[memorySegment]}
M=D`;
            case Constants_1.CommandType.push:
                this.lineNumber += 6;
                return `@${Constants_1.MemorySegmentMap[memorySegment]}
D=M
@SP
AM=M+1
A=A-1
M=D`;
        }
    }
    writeLocalArgumentThisOrThat(command, memorySegment, index) {
        switch (command) {
            case Constants_1.CommandType.pop:
                this.lineNumber += 12;
                return `@${Constants_1.MemorySegmentMap[memorySegment]}
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
            case Constants_1.CommandType.push:
                this.lineNumber += 9;
                return `@${Constants_1.MemorySegmentMap[memorySegment]}
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
    writeTemp(command, index) {
        switch (command) {
            case Constants_1.CommandType.pop:
                this.lineNumber += 5;
                return `@SP
AM=M-1
D=M
@${5 + Number(index)}
M=D`;
            case Constants_1.CommandType.push:
                this.lineNumber += 6;
                return `@${5 + Number(index)}
D=M
@SP
AM=M+1
A=A-1
M=D`;
        }
    }
    writeStatic(command, index, filename) {
        switch (command) {
            case Constants_1.CommandType.pop:
                this.lineNumber += 5;
                return `@SP
AM=M-1
D=M
@${filename}.${index}
M=D`;
            case Constants_1.CommandType.push:
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
exports.Coder = Coder;
