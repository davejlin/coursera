import { File } from "./File";
import { Parser } from "./Parser";
import os = require("os");
import { TokenStream } from "./TokenStream";

export class Main {
    constructor(private file: File, private tokenStream: TokenStream, private parser: Parser) {}

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
        const tokenWriteLine = async (output: string) => {
            await this.file.appendLine(output, tokensWriteStream);
        }

        const parserOutputFile = this.file.getOutFilePath(inputFile);
        const parserWriteStream = await this.file.init(parserOutputFile);
        const parserWriteLine = async (output: string) => {
            await this.file.appendLine(output, parserWriteStream);
        }        
        await this.parser.init(parserWriteLine);

        const readStream = this.file.getReadStreamAndInterface(inputFile);

        await tokenWriteLine(`<tokens>` + os.EOL);
        await this.tokenStream.init(readStream);
        await this.tokenizeFile(this.tokenStream, tokenWriteLine);
        this.tokenStream.deinit();
        await tokenWriteLine(`</tokens>` + os.EOL);

        await this.parser.deinit();
        await Promise.all([
            this.file.closeStream(tokensWriteStream), 
            this.file.closeStream(parserWriteStream)
        ]);

        console.log(`Outputted to ${tokenOutputFile}`);
        console.log(`Outputted to ${parserOutputFile}${os.EOL}`);
    }


    public async tokenizeFile(tokenStream: TokenStream, writeLine: (line:string) => Promise<void>) {
        return new Promise (async resolve => {
            while (tokenStream.hasNextToken()) {
                const token = tokenStream.nextToken();
                await writeLine(token.composeTag());
                await this.parser.nextToken(token);
            }
            resolve();
        });
    }
}
