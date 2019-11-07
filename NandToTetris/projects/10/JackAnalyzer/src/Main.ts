import { File } from "./File";
import { JackTokenizer } from "./JackTokenizer";
import { FileType } from "./Constants";
import os = require("os");
import fs = require("fs");

export class Main {
    constructor(
        private file: File,
        private tokenizer: JackTokenizer
    ) {}

    public async run(input: string): Promise<void> {
        console.log(`Processing ${input}`);
        const files = this.file.getFiles(input);
        await this.runTokenizer(files);
    }

    private async runTokenizer(files): Promise<void> {
        for (let file of files) {
            const outputFile = this.file.getOutFilePath(file, "T");
            const writeStream = await this.file.init(outputFile);
            await this.file.appendLine(`<tokens>`, writeStream);
            await this.processFile(file, writeStream);
            await this.file.appendLine(`</tokens>${os.EOL}`, writeStream);
            await this.file.closeStream(writeStream);
            console.log(`Outputted to ${outputFile}${os.EOL}`);
        }
    }

    private async processFile(inputFile: string, writeStream: fs.WriteStream): Promise<void> {
        return new Promise (resolve => {
            const { readStream, readInterface } = this.file.getReadStreamAndInterface(inputFile);
            const fileName = this.getFilename(inputFile);

            readInterface.on("line", async line => {
                const processedLine = this.tokenizer.tokenizeLine(line);
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
