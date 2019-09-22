"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const readline = require("readline");
const Constants_1 = require("./Constants");
class File {
    constructor() {
        this.firstLine = true;
    }
    async init(outFile) {
        return new Promise(resovle => {
            this.firstLine = true;
            this.deleteFile(outFile);
            const outStream = fs.createWriteStream(outFile, {
                flags: "a",
            });
            outStream.on("open", () => {
                resovle(outStream);
            });
        });
    }
    /**
     * Returns an array of .vm files
     * If input is a single .vm file, returns an array with only that file.
     * If input is a directory, returns all .vm files in that directory.
     * @param input
     */
    getFiles(input) {
        let hasSys = false;
        const files = [];
        if (this.isVMFile(input)) {
            files.push(input);
            return { files, hasSys };
        }
        fs.readdirSync(input).forEach(filename => {
            hasSys = filename.includes("Sys");
            const fullFilePath = `${input}/${filename}`;
            if (this.isVMFile(fullFilePath)) {
                files.push(fullFilePath);
            }
        });
        return { files, hasSys };
    }
    getReadStreamAndInterface(inFile) {
        const readStream = fs.createReadStream(inFile);
        const readInterface = readline.createInterface({
            input: readStream
        });
        return { readStream, readInterface };
    }
    appendLine(line, writeStream) {
        if (this.firstLine) {
            writeStream.write(line);
            this.firstLine = false;
        }
        else {
            writeStream.write(os.EOL + line);
        }
    }
    async closeStream(stream) {
        return new Promise(resolve => {
            stream.close();
            stream.on("close", () => {
                resolve();
            });
        });
    }
    deleteFile(file) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`File: Deleted ${file}`);
        }
        else {
            console.log(`File: Did not delete ${file}, because it does not exist`);
        }
    }
    isDirectory(path) {
        return fs.statSync(path).isDirectory();
    }
    isFile(path) {
        return fs.statSync(path).isFile();
    }
    isVMFile(path) {
        if (!this.isFile(path)) {
            return false;
        }
        const suffix = path.split(".");
        const length = suffix.length;
        if (length < 1) {
            return false;
        }
        if (suffix[length - 1] === "vm") {
            return true;
        }
        return false;
    }
    getOutFilePath(path) {
        const fullFilePathWithoutTypeSuffix = path.split(".")[0];
        if (this.isDirectory(path)) {
            const tokens = path.split("/");
            return `${fullFilePathWithoutTypeSuffix}/${tokens[tokens.length - 1]}.${Constants_1.FileSuffix.asm}`;
        }
        return `${fullFilePathWithoutTypeSuffix}.${Constants_1.FileSuffix.asm}`;
    }
}
exports.File = File;
