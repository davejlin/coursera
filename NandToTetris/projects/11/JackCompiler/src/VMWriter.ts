import os = require("os");
import { Symbol, Segment, Command } from "./Constants";

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
                await this.writeLine(`sub` + os.EOL);
                break;
            case Symbol.asterick:
                await this.writeLine(`call Math.multiply 2` + os.EOL);
                break;
            case Symbol.slash:
                await this.writeLine(`call Math.divide 2` + os.EOL);
                break;
            case Symbol.amperstand:
                await this.writeLine(`and` + os.EOL);
                break;
            case Symbol.pipe:
                await this.writeLine(`or` + os.EOL);
                break;
            case Symbol.lt:
                await this.writeLine(`lt` + os.EOL);
                break;
            case Symbol.gt:
                await this.writeLine(`gt` + os.EOL);
                break;
            case Symbol.eq:
                await this.writeLine(`eq` + os.EOL);
                break;
            case Command.neg:
                await this.writeLine(`neg` + os.EOL);
                break;
            case Command.not:
                await this.writeLine(`not` + os.EOL);
                break;
            default:
                await this.writeLine(`ERROR: UNKNOWN OPERATOR ${operator}` + os.EOL);
        }
    }

    /**
     * Writes a VM label command
     * @param label 
     */
    public async writeLabel(label: string): Promise<void> {
        await this.writeLine(`label ${label}` + os.EOL);
    }

    /**
     * Writes a VM goto command
     * @param label 
     */
    public async writeGoto(label: string): Promise<void> {
        await this.writeLine(`goto ${label}` + os.EOL);
    }

    /**
     * Writes a VM if-goto command
     * @param label 
     */
    public async writeIf(label: string): Promise<void> {
        await this.writeLine(`if-goto ${label}` + os.EOL);
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