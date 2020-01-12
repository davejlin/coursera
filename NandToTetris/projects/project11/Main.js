"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = require("./File");
const Constants_1 = require("./Constants");
const Parser_1 = require("./Parser");
const TokenStream_1 = require("./TokenStream");
const TokenWriter_1 = require("./TokenWriter");
const CompilationEngine_1 = require("./CompilationEngine");
const VMWriter_1 = require("./VMWriter");
class Main {
    constructor() { }
    async run(input) {
        console.log(`Processing ${input}`);
        const files = File_1.File.getFiles(input);
        for (let file of files) {
            await this.tokenize(file);
            await this.parse(file);
            await this.compile(file);
        }
        console.log(`Processed ${input}`);
    }
    async tokenize(file) {
        const outputFile = File_1.File.getOutFilePath(file, Constants_1.FileType.xml, "T");
        const { tokenStream, writeStream, writeLine } = await this.getStreams(file, outputFile);
        const tokenWriter = new TokenWriter_1.TokenWriter(tokenStream, writeLine);
        await this.process(tokenWriter);
        await File_1.File.closeStream(writeStream);
        console.log(`Tokens outputted to ${outputFile}`);
    }
    async parse(file) {
        const outputFile = File_1.File.getOutFilePath(file, Constants_1.FileType.xml);
        const { tokenStream, writeStream, writeLine } = await this.getStreams(file, outputFile);
        const parser = new Parser_1.Parser(tokenStream, writeLine);
        await this.process(parser);
        await File_1.File.closeStream(writeStream);
        console.log(`Parser outputted to ${outputFile}`);
    }
    async compile(file) {
        const outputFile = File_1.File.getOutFilePath(file, Constants_1.FileType.vm);
        const { tokenStream, writeStream, writeLine } = await this.getStreams(file, outputFile);
        const vmWriter = new VMWriter_1.VMWriter(writeLine);
        const compilationEngine = new CompilationEngine_1.CompilationEngine(tokenStream, vmWriter);
        await this.process(compilationEngine);
        await File_1.File.closeStream(writeStream);
        console.log(`Compiler outputted to ${outputFile}`);
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
