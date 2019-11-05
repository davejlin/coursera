import { File } from "./File";
import { Processor } from "./Processor";
import os = require("os");
import fs = require("fs");

export class Main {
    constructor(
        private file: File,
        private processor: Processor
    ) {}

    public async run(input: string): Promise<void> {
        console.log(`Processing ${input}`);
        const outputFile = this.file.getOutFilePath(input);
        const writeStream = await this.file.init(outputFile);
        const { files, hasSys } = this.file.getFiles(input);

        const bootstrap = this.processor.init();
        if (hasSys) {
            await this.file.appendLine(bootstrap, writeStream);
        }

        for (let file of files) {
            await this.processFile(file, writeStream);
        }

        await this.file.closeStream(writeStream);
        console.log(`Outputted to ${outputFile}${os.EOL}`);
    }

    private async processFile(inputFile: string, writeStream: fs.WriteStream): Promise<void> {
        return new Promise (resolve => {
            const { readStream, readInterface } = this.file.getReadStreamAndInterface(inputFile);
            const fileName = this.getFilename(inputFile);

            readInterface.on("line", async line => {
                const processedLine = this.processor.process(line, fileName);
                if (processedLine) {
                    await this.file.appendLine(`${processedLine}`, writeStream);
                }
            });

            readInterface.on("close", () => {
                readStream.on("close", () => {
                    resolve();
                })
            });
        });
    }

    /**
     * Returns the filename without path.
     * Needed if the inputFile is specified with a path.
     * @param fileNameWithPath
     */
    private getFilename(fileNameWithPath: string): string {
        const fileNameWithoutTypeSuffix = fileNameWithPath.split(".")[0];
        const filenamePathTokens = fileNameWithoutTypeSuffix.split("/");
        const length = filenamePathTokens.length;
        if (length < 2) {
            return fileNameWithPath;
        }
        return filenamePathTokens[length - 1];
    }
}
