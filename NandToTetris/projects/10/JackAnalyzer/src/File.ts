import fs = require("fs");
import os = require("os");
import readline = require("readline");
import { FileType } from "./Constants";

type Stream = fs.ReadStream | fs.WriteStream;

export class File {
    private firstLine = true;

    public async init(outFile: string): Promise<fs.WriteStream> {
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
     * Returns an array of .jack files
     * If input is a single .jack file, returns an array with only that file.
     * If input is a directory, returns all .jack files in that directory.
     * @param input 
     */
    public getFiles(input: string): string[] {
        const files: string[] = [];
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

    public getReadStreamAndInterface(inFile: string): { readStream: fs.ReadStream, readInterface: readline.Interface } {
        const readStream = fs.createReadStream(inFile);
        const readInterface = readline.createInterface({
            input: readStream
        });
        return { readStream, readInterface };
    }

    public async appendLine(line: string, writeStream: fs.WriteStream): Promise<void> {
        return new Promise(resolve => {
            if (this.firstLine) {
                writeStream.write(line, error => {
                    if (error) {
                        console.log(`File: appendLine error: ${error}`);
                    } else {
                        this.firstLine = false;
                    }
                    resolve();
                });
            } else {
                writeStream.write(os.EOL + line, error => {
                    if (error) {
                        console.log(`File: appendLine error: ${error}`);
                    }
                    resolve();
                });
            }
        })
    }

    public async closeStream<T extends Stream>(stream: T): Promise<void> {
        return new Promise(resolve => {
            stream.close();
            stream.on("close", () => {
                resolve();
            });
        });
    }

    private deleteFile(file: string) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`File: Deleted ${file}`);
        } else {
            console.log(`File: Did not delete ${file}, because it does not exist`);
        }
    }

    private isDirectory(path: string): boolean {
        return fs.statSync(path).isDirectory();
    }

    private isFile(path: string): boolean {
        return fs.statSync(path).isFile();
    }

    private isJackFile(path: string): boolean {
        if (!this.isFile(path)) {
            return false;
        }

        const suffix = path.split(".");
        const length = suffix.length;
        if (length < 1) {
            return false;
        }

        if (suffix[length-1] === FileType.jack) {
            return true;
        }

        return false;
    }

    public getOutFilePath(path: string, nameSuffix: string = ""): string {
        const fullFilePathWithoutTypeSuffix = path.split(".")[0];

        if (this.isDirectory(path)) {
            const tokens = path.split("/");
            return `${fullFilePathWithoutTypeSuffix}/${tokens[tokens.length-1]}${nameSuffix}.${FileType.xml}`
        }

        return `${fullFilePathWithoutTypeSuffix}${nameSuffix}.${FileType.xml}`;
    }
}
