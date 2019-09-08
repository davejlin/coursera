"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const readline = require("readline");
class File {
    constructor() {
        this.firstLine = true;
    }
    async init(outFile) {
        return new Promise(resovle => {
            this.firstLine = true;
            this.deleteFile(outFile);
            this.outStream = fs.createWriteStream(outFile, {
                flags: "a",
            });
            this.outStream.on("open", () => {
                resovle();
            });
        });
    }
    getReadInterface(inFile) {
        this.inStream = fs.createReadStream(inFile);
        return readline.createInterface({
            input: this.inStream
        });
    }
    appendLine(line) {
        if (this.firstLine) {
            this.outStream.write(line);
            this.firstLine = false;
        }
        else {
            this.outStream.write(os.EOL + line);
        }
    }
    async closeFiles() {
        return new Promise(resolve => {
            let outStreamClosed = false;
            let inStreamClosed = false;
            this.outStream.close();
            this.inStream.close();
            this.outStream.on("close", () => {
                outStreamClosed = true;
                if (inStreamClosed) {
                    resolve();
                }
            });
            this.inStream.on("close", () => {
                inStreamClosed = true;
                if (outStreamClosed) {
                    resolve();
                }
            });
        });
    }
    getReadStream() {
        return this.inStream;
    }
    getWriteStream() {
        return this.outStream;
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
}
exports.File = File;
