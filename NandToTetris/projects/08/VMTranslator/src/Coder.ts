import os = require("os");
import { MemorySegment, MemorySegmentMap, CommandType, Command, Descriptor } from "./Constants";

export class Coder {
    private returnIndex = 0;

    constructor() {
        this.init();
    }
    public init() {
        this.returnIndex = 0;
    }

    public writeBootstrap() {
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
    public writeArithmetic(command: string, filename: string): string {
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
                return this.writeEqLtGt("JNE", filename); // use NE for EQ due to jump condition
            case Command.lt:
                return this.writeEqLtGt("JGE", filename); // use GE for LT due to jump condition
            case Command.gt:
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
        const prefix = functionName.length > 0 ? `${functionName}:` : ``;
        return `${openSymbol}${prefix}${label}${closeSymbol}`;
    }

    public writeGoto(label: string, functionName: string): string {
        return `     @${this.writeLabel(label, functionName, "", "")}
     0;JMP`
    }

    public writeIfGoto(label: string, functionName: string): string {
        return `     @SP
     AM=M-1
     D=M
     @${this.writeLabel(label, functionName, "", "")}
     D;JNE`
    }

    public writeFunction(functionName: string, index: string) {
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
        const returnAddressLabel = this.getLabelName(filename, Descriptor.return);
        return `     @${returnAddressLabel}
     D=A
     @SP
     AM=M+1
     A=A-1
     M=D        // push ${returnAddressLabel}
     ${this.pushPointerToStack(MemorySegment.local)}
     ${this.pushPointerToStack(MemorySegment.argument)}
     ${this.pushPointerToStack(MemorySegment.this)}
     ${this.pushPointerToStack(MemorySegment.that)}
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
${this.writeLabel(returnAddressLabel, "")}`;
    }

    public writeReturn(): string {
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
     ${this.writeSetValue(endFrame, MemorySegmentMap[MemorySegment.that], "1")}
     ${this.writeSetValue(endFrame, MemorySegmentMap[MemorySegment.this], "2")}
     ${this.writeSetValue(endFrame, MemorySegmentMap[MemorySegment.argument], "3")}
     ${this.writeSetValue(endFrame, MemorySegmentMap[MemorySegment.local], "4")}
     @${retAddr}
     A=M
     0;JMP      // goto retAddr`;
    }

    private writeSetValue(from: string, to: string, addressOffset: string) {
        return `@${from}
     D=M
     @${addressOffset}
     D=D-A
     A=D
     D=M
     @${to}
     M=D        // ${to} = *(${from} - ${addressOffset})`
    }

    private pushPointerToStack(from: MemorySegment) {
        const fromSegment = MemorySegmentMap[from];
        return `@${fromSegment}
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D      // push ${fromSegment}`
    }

    private writeAddSubAndOr(directive: string): string {
        return `     @SP
     AM=M-1
     D=M
     A=A-1
     M=${directive}`;
    }

    private writeNegNot(directive: string): string {
        return `     @SP
     A=M-1
     M=${directive}M`;
    }

    private writeEqLtGt(directive: string, filename: string): string {
        const continueLabel = this.getLabelName(filename, Descriptor.continue); 
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

    private writePushConstant(index: string): string {
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
                return `     @SP
     AM=M-1
     D=M
     @${MemorySegmentMap[memorySegment]}
     M=D`;
            case CommandType.push:
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
                return `     @SP
     AM=M-1
     D=M
     @${5 + Number(index)}
     M=D`;
            case CommandType.push:
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
                return `     @SP
     AM=M-1
     D=M
     @${filename}.${index}
     M=D`;
            case CommandType.push:
                return `     @${filename}.${index}
     D=M
     @SP
     AM=M+1
     A=A-1
     M=D`;
        }
    }

    private getLabelName(filename: string, descriptor: string) {
        return `${filename}$${descriptor}.${this.returnIndex++}`
    }
}
