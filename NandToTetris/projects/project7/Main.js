"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
const os = require("os");
class Main {
    constructor(file, processor) {
        this.file = file;
        this.processor = processor;
    }
    async run(inputFile) {
        console.log(`Processing ${inputFile}`);
        const fullFilePathWithoutTypeSuffix = inputFile.split(".")[0];
        const outputFile = fullFilePathWithoutTypeSuffix + Constants_1.FileSuffix.asm;
        await this.file.init(outputFile);
        await this.process(inputFile, fullFilePathWithoutTypeSuffix);
        await this.file.closeFiles();
        console.log(`Outputted to ${outputFile}${os.EOL}`);
    }
    async process(inputFile, filename) {
        return new Promise(resolve => {
            this.processor.init();
            const readInterface = this.file.getReadInterface(inputFile);
            readInterface.on("line", line => {
                const processedLine = this.processor.process(line, this.getFilename(filename));
                if (processedLine) {
                    this.file.appendLine(`${processedLine}`);
                }
            });
            readInterface.on("close", () => {
                resolve();
            });
        });
    }
    /**
     * Returns the filename without path.
     * Needed if the inputFile is specified with a path.
     * @param fileNameWithPath
     */
    getFilename(fileNameWithPath) {
        const filenamePathTokens = fileNameWithPath.split("/");
        const length = filenamePathTokens.length;
        if (length < 2) {
            return fileNameWithPath;
        }
        return filenamePathTokens[length - 1];
    }
}
exports.Main = Main;
