"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
class Main {
    constructor(file, processor) {
        this.file = file;
        this.processor = processor;
    }
    async run(input) {
        console.log(`Processing ${input}`);
        const outputFile = this.file.getOutFilePath(input);
        const writeStream = await this.file.init(outputFile);
        const { files, hasSys } = this.file.getFiles(input);
        const bootstrap = this.processor.init();
        if (hasSys) {
            this.file.appendLine(bootstrap, writeStream);
        }
        for (let file of files) {
            await this.processFile(file, writeStream);
        }
        await this.file.closeStream(writeStream);
        console.log(`Outputted to ${outputFile}${os.EOL}`);
    }
    async processFile(inputFile, writeStream) {
        return new Promise(resolve => {
            const { readStream, readInterface } = this.file.getReadStreamAndInterface(inputFile);
            const fileName = this.getFilename(inputFile);
            readInterface.on("line", line => {
                const processedLine = this.processor.process(line, fileName);
                if (processedLine) {
                    this.file.appendLine(`${processedLine}`, writeStream);
                }
            });
            readInterface.on("close", () => {
                readStream.on("close", () => {
                    resolve();
                });
            });
        });
    }
    /**
     * Returns the filename without path.
     * Needed if the inputFile is specified with a path.
     * @param fileNameWithPath
     */
    getFilename(fileNameWithPath) {
        const fileNameWithoutTypeSuffix = fileNameWithPath.split(".")[0];
        const filenamePathTokens = fileNameWithoutTypeSuffix.split("/");
        const length = filenamePathTokens.length;
        if (length < 2) {
            return fileNameWithPath;
        }
        return filenamePathTokens[length - 1];
    }
}
exports.Main = Main;
