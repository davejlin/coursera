import os = require("os");
import { Symbol, Segment } from "./Constants";

export class VMWriter {
    constructor (private writeLine: (line: string) => Promise<void>) {}

    /**
     * Writes a VM push command
     * @param segment 
     * @param index 
     */
    public async writePush(segment: Segment, index: number): Promise<void> {
        await this.writeLine(`push ${segment} ${index}` + os.EOL);
    }

    /**
     * Writes a VM pop command
     * @param segment 
     * @param index 
     */
    public async writePop(segment: Segment, index: number): Promise<void> {
        await this.writeLine(`pop ${segment} ${index}` + os.EOL);
    }

    /**
     * Writes a VM arithmetic-logical command
     * @param operator 
     */
    public async writeArithmetic(operator: string): Promise<void> {
        switch (operator) {
            case Symbol.plus:
                await this.writeLine(`add` + os.EOL);
                break;
            case Symbol.minus:
                break;
            case Symbol.asterick:
                await this.writeLine(`call Math.multiply 2` + os.EOL);
                break;
            case Symbol.slash:
                break;
            case Symbol.amperstand:
                break;
            case Symbol.pipe:
                break;
            case Symbol.lt:
                break;
            case Symbol.gt:
                break;
            default:
                await this.writeLine(`ERROR: UNKNOWN OPERATOR` + os.EOL);
        }
    }

    /**
     * Writes a VM label command
     * @param label 
     */
    public async writeLabel(label: string): Promise<void> {

    }

    /**
     * Writes a VM goto command
     * @param label 
     */
    public async writeGoto(label: string): Promise<void> {

    }

    /**
     * Writes a VM if-goto command
     * @param label 
     */
    public async writeIf(label: string): Promise<void> {

    }

    /**
     * Writes a VM call command
     * @param name 
     * @param nArgs 
     */
    public async writeCall(name: string, nArgs: number): Promise<void> {
        await this.writeLine(`call ${name} ${nArgs}` + os.EOL);
    }

    /**
     * Writes a VM function command
     * @param name 
     * @param nArgs 
     */
    public async writeFunction(name: string, nArgs: number): Promise<void> {
        await this.writeLine(`function ${name} ${nArgs}` + os.EOL);
    }

    /**
     * Writes a VMW return command
     */
    public async writeReturn(): Promise<void> {
        await this.writeLine(`return` + os.EOL);
    }

    /**
     * Closes the output file
     */
    public close(): void {

    }
}