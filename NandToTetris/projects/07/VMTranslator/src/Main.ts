import { File } from "./File";
import { Processor } from "./Processor";
import { FileSuffix } from "./Constants";
import os = require("os");

export class Main {
    constructor(
        private file: File,
         private processor: Processor
    ) {}

    public async run(inputFile: string): Promise<void> {
        console.log(`Processing ${inputFile}`);
        const fullFilePathWithoutTypeSuffix = inputFile.split(".")[0];
        const outputFile = fullFilePathWithoutTypeSuffix + FileSuffix.asm;
        await this.file.init(outputFile);
        await this.process(inputFile, fullFilePathWithoutTypeSuffix);
        await this.file.closeFiles();
        console.log(`Outputted to ${outputFile}${os.EOL}`);
    }

    private async process(inputFile: string, filename: string): Promise<void> {
        return new Promise (resolve => {
            this.processor.init();
            const readInterface = this.file.getReadInterface(inputFile);

            readInterface.on("line", async line => {
                const processedLine = this.processor.process(line, this.getFilename(filename));
                if (processedLine) {
                    await this.file.appendLine(`${processedLine}`);
                }
            });

            readInterface.on("close", () => {
                resolve();
            });
        });
    }

    /**
     * Returns the filename without path.
     * Needed if the inputFile is specified with a path.
     * @param fileNameWithPath
     */
    private getFilename(fileNameWithPath: string): string {
        const filenamePathTokens = fileNameWithPath.split("/");
        const length = filenamePathTokens.length;
        if (length < 2) {
            return fileNameWithPath;
        }
        return filenamePathTokens[length - 1];
    }
}
