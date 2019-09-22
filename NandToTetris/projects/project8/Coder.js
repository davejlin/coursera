"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const Constants_1 = require("./Constants");
class Coder {
    constructor() {
        this.returnIndex = 0;
        this.init();
    }
    init() {
        this.returnIndex = 0;
    }
    writeBootstrap() {
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
    writeArithmetic(command, filename) {
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
                return this.writeEqLtGt("JNE", filename); // use NE for EQ due to jump condition
            case Constants_1.Command.lt:
                return this.writeEqLtGt("JGE", filename); // use GE for LT due to jump condition
            case Constants_1.Command.gt:
                return this.writeEqLtGt("JLE", filename); // use LE for GT due to jump condition
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
    writeLabel(label, functionName, openSymbol = "(", closeSymbol = ")") {
        const prefix = functionName.length > 0 ? `${functionName}:` : ``;
        return `${openSymbol}${prefix}${label}${closeSymbol}`;
    }
    writeGoto(label, functionName) {
        return `     @${this.writeLabel(label, functionName, "", "")}
     0;JMP`;
    }
    writeIfGoto(label, functionName) {
        return `     @SP
     AM=M-1
     D=M
     @${this.writeLabel(label, functionName, "", "")}
     D;JNE`;
    }
    writeFunction(functionName, index) {
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
    writeCall(functionName, nArgs, filename) {
        const returnAddressLabel = this.getLabelName(filename, Constants_1.Descriptor.return);
        return `     @${returnAddressLabel}
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push ${returnAddressLabel}
     ${this.pushPointerToStack(Constants_1.MemorySegment.local)}
     ${this.pushPointerToStack(Constants_1.MemorySegment.argument)}
     ${this.pushPointerToStack(Constants_1.MemorySegment.this)}
     ${this.pushPointerToStack(Constants_1.MemorySegment.that)}
     @SP
     D=M
     @5
     D=D-A
     @${nArgs}
     D=D-A
     @${Constants_1.MemorySegmentMap[Constants_1.MemorySegment.argument]}
     M=D        // ARG[0] = SP - 5 - nArgs
     @SP
     D=M
     @${Constants_1.MemorySegmentMap[Constants_1.MemorySegment.local]}
     M=D        // LCL = SP
     @${functionName}
     0;JMP
${this.writeLabel(returnAddressLabel, "")}`;
    }
    writeReturn() {
        const retAddr = "retAddr";
        const endFrame = "endFrame";
        return `     @${Constants_1.MemorySegmentMap[Constants_1.MemorySegment.local]}
     D=M
     @${endFrame}
     M=D        // endFrame = LCL
     @5
     D=D-A
     A=D
     D=M
     @${retAddr}
     M=D        // retAddr = *(endFrame – 5)
     @${Constants_1.MemorySegmentMap[Constants_1.MemorySegment.argument]}
     D=M
     @R13
     M=D        // R13 = ARG[0]
     @SP
     A=M-1
     D=M
     @${Constants_1.MemorySegmentMap[Constants_1.MemorySegment.argument]}
     A=M
     M=D        // *ARG[0] = POP()
     @R13
     D=M
     @SP
     M=D+1      // SP = ARG[0] + 1
     ${this.writeSetValue(endFrame, Constants_1.MemorySegmentMap[Constants_1.MemorySegment.that], "1")}
     ${this.writeSetValue(endFrame, Constants_1.MemorySegmentMap[Constants_1.MemorySegment.this], "2")}
     ${this.writeSetValue(endFrame, Constants_1.MemorySegmentMap[Constants_1.MemorySegment.argument], "3")}
     ${this.writeSetValue(endFrame, Constants_1.MemorySegmentMap[Constants_1.MemorySegment.local], "4")}
     @${retAddr}
     A=M
     0;JMP      // goto retAddr`;
    }
    writeSetValue(from, to, addressOffset) {
        return `@${from}
     D=M
     @${addressOffset}
     D=D-A
     A=D
     D=M
     @${to}
     M=D        // ${to} = *(${from} - ${addressOffset})`;
    }
    pushPointerToStack(from) {
        const fromSegment = Constants_1.MemorySegmentMap[from];
        return `@${fromSegment}
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push ${fromSegment}`;
    }
    writeAddSubAndOr(directive) {
        return `     @SP
     AM=M-1
     D=M
     A=A-1
     M=${directive}`;
    }
    writeNegNot(directive) {
        return `     @SP
     A=M-1
     M=${directive}M`;
    }
    writeEqLtGt(directive, filename) {
        const continueLabel = this.getLabelName(filename, Constants_1.Descriptor.continue);
        const returnString = `     @SP
     AM=M-1
     D=M
     A=A-1
     D=M-D
     M=0
     @${continueLabel}
     D;${directive}
     @SP
     A=M-1
     M=-1
${this.writeLabel(continueLabel, "")}`;
        return returnString;
    }
    writePushConstant(index) {
        return `     @${index}
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
                return `     @SP
     AM=M-1
     D=M
     @${Constants_1.MemorySegmentMap[memorySegment]}
     M=D`;
            case Constants_1.CommandType.push:
                return `     @${Constants_1.MemorySegmentMap[memorySegment]}
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
                return `     @${Constants_1.MemorySegmentMap[memorySegment]}
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
                return `     @${Constants_1.MemorySegmentMap[memorySegment]}
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
                return `     @SP
     AM=M-1
     D=M
     @${5 + Number(index)}
     M=D`;
            case Constants_1.CommandType.push:
                return `     @${5 + Number(index)}
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
                return `     @SP
     AM=M-1
     D=M
     @${filename}.${index}
     M=D`;
            case Constants_1.CommandType.push:
                return `     @${filename}.${index}
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D`;
        }
    }
    getLabelName(filename, descriptor) {
        return `${filename}$${descriptor}.${this.returnIndex++}`;
    }
}
exports.Coder = Coder;
