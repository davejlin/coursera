import { File } from "./File";
import os = require("os");
import fs = require("fs");

export class Main {
    constructor(
        private file: File
    ) {}

    public async run(input: string): Promise<void> {
        console.log(`Processing ${input}`);
        const files = this.file.getFiles(input);

        for (let file of files) {
            const outputFile = this.file.getOutFilePath(file);
            const writeStream = await this.file.init(outputFile);
            await this.processFile(file, writeStream);
            await this.file.closeStream(writeStream);
            console.log(`Outputted to ${outputFile}${os.EOL}`);
        }
    }

    private async processFile(inputFile: string, writeStream: fs.WriteStream): Promise<void> {
        return new Promise (resolve => {
            const { readStream, readInterface } = this.file.getReadStreamAndInterface(inputFile);
            const fileName = this.getFilename(inputFile);

            readInterface.on("line", line => {
                const processedLine = `${fileName}`;
                if (processedLine) {
                    this.file.appendLine(`${processedLine}`, writeStream);
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
