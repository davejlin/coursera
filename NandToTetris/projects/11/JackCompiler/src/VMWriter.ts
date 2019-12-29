import { Command, Segment } from "./Constants";

export class VMWriter {
    constructor (private writeLine: (line: string) => Promise<void>) {}

    /**
     * Writes a VM push command
     * @param segment 
     * @param index 
     */
    public async writePush(segment: Segment, index: number): Promise<void> {

    }

    /**
     * Writes a VM pop command
     * @param segment 
     * @param index 
     */
    public async writePop(segment: Segment, index: number): Promise<void> {

    }

    /**
     * Writes a VM arithmetic-logical command
     * @param command 
     */
    public async writeArithmetic(command: Command): Promise<void> {

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

    }

    /**
     * Writes a VM function command
     * @param name 
     * @param nArgs 
     */
    public async writeFunction(name: string, nArgs: number): Promise<void> {

    }

    /**
     * Writes a VMW return command
     */
    public async writeReturn(): Promise<void> {

    }

    /**
     * Closes the output file
     */
    public close(): void {

    }
}