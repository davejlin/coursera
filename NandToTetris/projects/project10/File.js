"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Constants_1 = require("./Constants");
class File {
    static async init(outFile) {
        return new Promise(resovle => {
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
     * Returns an array of .jack files
     * If input is a single .jack file, returns an array with only that file.
     * If input is a directory, returns all .jack files in that directory.
     * @param input
     */
    static getFiles(input) {
        const files = [];
        if (this.isJackFile(input)) {
            files.push(input);
            return files;
        }
        fs.readdirSync(input).forEach(filename => {
            const fullFilePath = `${input}/${filename}`;
            if (this.isJackFile(fullFilePath)) {
                files.push(fullFilePath);
            }
        });
        return files;
    }
    static getReadStreamAndInterface(inFile) {
        return fs.createReadStream(inFile, {
            encoding: "utf8"
        });
    }
    static async appendLine(line, writeStream) {
        return new Promise(resolve => {
            writeStream.write(line, error => {
                if (error) {
                    console.log(`File: appendLine error: ${error}`);
                }
                resolve();
            });
        });
    }
    static async closeStream(stream) {
        return new Promise(resolve => {
            stream.close();
            stream.on("close", () => {
                resolve();
            });
        });
    }
    static deleteFile(file) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`File: Deleted ${file}`);
        }
        else {
            console.log(`File: Did not delete ${file}, because it does not exist`);
        }
    }
    static isDirectory(path) {
        return fs.statSync(path).isDirectory();
    }
    static isFile(path) {
        return fs.statSync(path).isFile();
    }
    static isJackFile(path) {
        if (!this.isFile(path)) {
            return false;
        }
        const suffix = path.split(".");
        const length = suffix.length;
        if (length < 1) {
            return false;
        }
        if (suffix[length - 1] === Constants_1.FileType.jack) {
            return true;
        }
        return false;
    }
    static getOutFilePath(path, nameSuffix = "") {
        const fullFilePathWithoutTypeSuffix = path.split(".")[0];
        if (this.isDirectory(path)) {
            const tokens = path.split("/");
            return `${fullFilePathWithoutTypeSuffix}/${tokens[tokens.length - 1]}${nameSuffix}.${Constants_1.FileType.xml}`;
        }
        return `${fullFilePathWithoutTypeSuffix}${nameSuffix}.${Constants_1.FileType.xml}`;
    }
}
exports.File = File;
