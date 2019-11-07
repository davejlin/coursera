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
            await this.processFile(file);
            await this.outputTokensXml(writeStream);
            await this.file.closeStream(writeStream);
            console.log(`Outputted to ${outputFile}${os.EOL}`);
        }
    }

    private async processFile(inputFile: string): Promise<void> {
        return new Promise (resolve => {
            this.tokenizer.clearTokens();
            const { readStream, readInterface } = this.file.getReadStreamAndInterface(inputFile);

            readInterface.on("line", async line => {
                this.tokenizer.tokenizeLine(line);
            });

            readInterface.on("close", () => {
                readStream.on("close", () => {
                    resolve();
                })
            });
        });
    }

    private async outputTokensXml(writeStream: fs.WriteStream): Promise<void> {
        await this.file.appendLine(`<tokens>`, writeStream);
        const tokens = this.tokenizer.tokens;
        tokens.forEach(async token => {
            const output = token.composeTag();
            await this.file.appendLine(output, writeStream);
        });
        await this.file.appendLine(`</tokens>${os.EOL}`, writeStream);
    }
}
