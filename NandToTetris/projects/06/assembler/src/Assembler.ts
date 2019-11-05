import { inject, injectable } from "inversify";
import { TYPES } from "./di/types";
import { File } from "./File";
import { Processor } from "./Processor";
import os = require("os");

@injectable()
export class Assembler {
    constructor(
        @inject(TYPES.File) private file: File,
        @inject(TYPES.Processor) private processor: Processor
    ) {}

    public async run(files: string[]): Promise<void> {
        for (const file of files) {
            const inputFile = file + ".asm";
            const outputFile = file + ".hack";
            console.log(`Processing ${inputFile}`);

            this.processor.init();
            await this.file.init(outputFile);
            await this.firstPass(inputFile);
            await this.secondPass(inputFile);
            await this.file.closeFiles();
            console.log(`Outputted to ${outputFile}${os.EOL}`);
        }
    }

    private async firstPass(inputFile: string): Promise<void> {
        return new Promise (resolve => {
            const readInterface = this.file.getReadInterface(inputFile);

            readInterface.on("line", line => {
                this.processor.fillSymbolTable(line);
            });

            readInterface.on("close", () => {
                resolve();
            });
        });
    }

    private async secondPass(inputFile: string): Promise<void> {
        return new Promise (resolve => {
            const readInterface = this.file.getReadInterface(inputFile);

            readInterface.on("line", async line => {
                const processedLine = this.processor.process(line);
                if (processedLine) {
                    await this.file.appendLine(processedLine);
                }
            });

            readInterface.on("close", () => {
                resolve();
            });
        });
    }
}
