import { File } from "./File";
import { Tokenizer } from "./Tokenizer";
import { Token } from "./Token";
import { ReadStream, WriteStream } from "fs";
import { Interface } from "readline";
import { Parser } from "./Parser";
import os = require("os");

export class Main {
    constructor(private file: File, private tokenizer: Tokenizer, private parser: Parser) {}

    public async run(input: string): Promise<void> {
        console.log(`Processing ${input}`);
        const files = this.file.getFiles(input);
        await this.process(files);
        console.log(`Processed ${input}`);
    }

    private async process(files): Promise<void> {
        for (let file of files) {
            await this.tokenize(file);
        }
    }

    private async tokenize(inputFile: string): Promise<void> {
        const tokenOutputFile = this.file.getOutFilePath(inputFile, "T");
        const tokensWriteStream = await this.file.init(tokenOutputFile);

        const parserOutputFile = this.file.getOutFilePath(inputFile);
        const parserWriteStream = await this.file.init(parserOutputFile);

        const parserWriteLine = async (output: string) => {
            await this.file.appendLine(output, parserWriteStream);
        }
        
        await this.parser.init(parserWriteLine);

        const { readStream, readInterface } = this.file.getReadStreamAndInterface(inputFile);
        
        await this.tokenizeFile(readStream, readInterface, tokensWriteStream);
        await this.parser.deinit();

        readStream.destroy();
        await this.file.closeStream(tokensWriteStream);
        await this.file.closeStream(parserWriteStream);

        console.log(`Outputted to ${tokenOutputFile}`);
        console.log(`Outputted to ${parserOutputFile}${os.EOL}`);
    }


    public async tokenizeFile(readStream: ReadStream, readInterface: Interface, tokensWriteStream: WriteStream) {
        const tokenWriteLine = async (output: string) => {
            await this.file.appendLine(output, tokensWriteStream);
        }
    
        await tokenWriteLine(`<tokens>` + os.EOL);
        return new Promise (resolve => {

            readInterface.on("line", async line => {
                await this.tokenizeLine(line, tokenWriteLine);
            });

            readInterface.on("close", () => {
                readStream.on("close", async () => {
                    await tokenWriteLine(`</tokens>` + os.EOL);
                    resolve();
                })
            });
        });
    }

    public async tokenizeLine(line: string, writeLine: (string: string) => Promise<void>): Promise<void> {
        const lineTokens = this.tokenizer.getTokens(line);
        if (lineTokens) {
            lineTokens.forEach(async aToken => {
                if (aToken) {
                    const type = this.tokenizer.getType(aToken);
                    const token = new Token(type, aToken)  // the next token
                    await writeLine(token.composeTag());
                    this.parser.nextToken(token);
                }
            })
        }
    }
}
