import { File } from "./File";
import { Parser } from "./Parser";
import { TokenStream } from "./TokenStream";
import { TokenWriter } from "./TokenWriter";
import { Processor } from "./Processor";
import { WriteStream } from "fs";

export class Main {
    constructor() {}

    public async run(input: string): Promise<void> {
        console.log(`Processing ${input}`);
        const files = File.getFiles(input);
        for (let file of files) {
            await this.tokenize(file);
            await this.compile(file);
        }
        console.log(`Processed ${input}`);
    }

    private async tokenize(file: string): Promise<void> {
        const outputFile = File.getOutFilePath(file, "T");
        const { tokenStream, writeStream, writeLine } = await this.getStreams(file, outputFile);
        const tokenWriter = new TokenWriter(tokenStream, writeLine);
        await this.process(tokenWriter);
        await File.closeStream(writeStream);
        console.log(`Tokens outputted to ${outputFile}`);
    }

    private async compile(file: string): Promise<void>  {
        const outputFile = File.getOutFilePath(file);
        const { tokenStream, writeStream, writeLine } = await this.getStreams(file, outputFile);
        const parser = new Parser(tokenStream, writeLine);
        await this.process(parser);
        await File.closeStream(writeStream);
        console.log(`Compile outputted to ${outputFile}`);
    }

    private async getStreams(inputFile: string, outputFile: string): Promise<{tokenStream: TokenStream, writeStream: WriteStream, writeLine: (output: string) => Promise<void>}> {
        const writeStream = await File.init(outputFile);
        const writeLine = async (output: string) => {
            await File.appendLine(output, writeStream);
        }
        const readStream = File.getReadStreamAndInterface(inputFile);
        const tokenStream = new TokenStream(readStream);
        return { tokenStream, writeStream, writeLine };
    }

    private async process(processor: Processor) {
        await processor.init();
        await processor.process();
        processor.deinit();
    }
}
