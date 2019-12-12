"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = require("./File");
const Parser_1 = require("./Parser");
const TokenStream_1 = require("./TokenStream");
const TokenWriter_1 = require("./TokenWriter");
class Main {
    constructor() { }
    async run(input) {
        console.log(`Processing ${input}`);
        const files = File_1.File.getFiles(input);
        for (let file of files) {
            await this.tokenize(file);
            await this.parse(file);
        }
        console.log(`Processed ${input}`);
    }
    async tokenize(file) {
        const outputFile = File_1.File.getOutFilePath(file, "T");
        const { tokenStream, writeStream, writeLine } = await this.getStreams(file, outputFile);
        const tokenWriter = new TokenWriter_1.TokenWriter(tokenStream, writeLine);
        await this.process(tokenWriter);
        await File_1.File.closeStream(writeStream);
        console.log(`Tokens outputted to ${outputFile}`);
    }
    async parse(file) {
        const outputFile = File_1.File.getOutFilePath(file);
        const { tokenStream, writeStream, writeLine } = await this.getStreams(file, outputFile);
        const parser = new Parser_1.Parser(tokenStream, writeLine);
        await this.process(parser);
        await File_1.File.closeStream(writeStream);
        console.log(`Parser outputted to ${outputFile}`);
    }
    async getStreams(inputFile, outputFile) {
        const writeStream = await File_1.File.init(outputFile);
        const writeLine = async (output) => {
            await File_1.File.appendLine(output, writeStream);
        };
        const readStream = File_1.File.getReadStreamAndInterface(inputFile);
        const tokenStream = new TokenStream_1.TokenStream(readStream);
        return { tokenStream, writeStream, writeLine };
    }
    async process(processor) {
        await processor.init();
        await processor.process();
        processor.deinit();
    }
}
exports.Main = Main;
