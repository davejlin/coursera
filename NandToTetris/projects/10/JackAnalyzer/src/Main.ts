import { File } from "./File";
import { Tokenizer } from "./Tokenizer";
import os = require("os");
import { Parser } from "./Parser";
import { Token } from "./Token";

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
        await this.file.appendLine(`<tokens>`, writeStream);

        return new Promise (resolve => {
            const { readStream, readInterface } = this.file.getReadStreamAndInterface(inputFile);

            readInterface.on("line", async line => {
                const tokens = this.tokenizer.tokenizeLine(line);
                tokens.forEach(async token => {
                    const output = token.composeTag();
                    await this.file.appendLine(output, writeStream);
                });
            });

            readInterface.on("close", () => {
                readStream.on("close", async () => {
                    await this.file.appendLine(`</tokens>${os.EOL}`, writeStream);
                    await this.file.closeStream(writeStream);
                    resolve();
                })
            });
        });
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
