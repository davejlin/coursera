import { File } from "./File";
import { Tokenizer } from "./Tokenizer";
import os = require("os");
import { Parser } from "./Parser";
import { Token } from "./Token";
import { ReadStream } from "fs";
import { Interface } from "readline";

export class Main {
    constructor(
        private file: File,
        private tokenizer: Tokenizer,
        private parser: Parser
    ) {}

    public async run(input: string): Promise<void> {
        console.log(`Processing ${input}`);
        const files = this.file.getFiles(input);
        await this.process(files);
        console.log(`Processed ${input}`);
    }

    private async process(files): Promise<void> {
        for (let file of files) {
            const outputTokenFile = this.file.getOutFilePath(file, "T");
            await this.tokenize(file, outputTokenFile);
            console.log(`Outputted to ${outputTokenFile}`);

            const outputCompiledFile = this.file.getOutFilePath(file);
            await this.compile(outputTokenFile, outputCompiledFile)
            console.log(`Outputted to ${outputCompiledFile}${os.EOL}`);
        }
    }

    private async tokenize(inputFile: string, outputFile: string): Promise<void> {
        const writeStream = await this.file.init(outputFile);
        const writeLine = async (output: string) => {
            await this.file.appendLine(output, writeStream);
        }
        const { readStream, readInterface } = this.file.getReadStreamAndInterface(inputFile);

        await this.tokenizeFile(readStream, readInterface, writeLine);
        readStream.destroy();
        await this.file.closeStream(writeStream);
    }


    public async tokenizeFile(readStream: ReadStream, readInterface: Interface, writeLine: (output: string) => Promise<void>) {
        await writeLine(`<tokens>`);
        return new Promise (resolve => {

            readInterface.on("line", async line => {
                await this.tokenizeLine(line, writeLine);
            });

            readInterface.on("close", () => {
                readStream.on("close", async () => {
                    await writeLine(`</tokens>${os.EOL}`);
                    resolve();
                })
            });
        });
    }

    public async tokenizeLine(line: string, writeLine: (string) => Promise<void>): Promise<void> {
        const lineTokens = this.tokenizer.getTokens(line);
        if (lineTokens) {
            lineTokens.forEach(async lineToken => {
                if (lineToken) {
                    const type = this.tokenizer.getType(lineToken);
                    const token = new Token(type, lineToken)  // the next token
                    await writeLine(token.composeTag());
                }
            })
        }
    }

    private async compile(inputFile: string, outputFile: string): Promise<void> {
        const writeStream = await this.file.init(outputFile);

        return new Promise (resolve => {
            const { readStream, readInterface } = this.file.getReadStreamAndInterface(inputFile);

            readInterface.on("line", async line => {
                await this.file.appendLine(line, writeStream);
            });

            readInterface.on("close", () => {
                readStream.on("close", async () => {
                    await this.file.closeStream(writeStream);
                    resolve();
                })
            });
        });
    }
}
