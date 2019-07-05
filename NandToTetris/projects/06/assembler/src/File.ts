import { injectable } from "inversify";
import fs = require("fs");
import os = require("os");
import readline = require("readline");

@injectable()
export class File {
    private outStream: fs.WriteStream;
    private inStream: fs.ReadStream;
    private firstLine = true;

    public async init(outFile: string): Promise<void> {
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

    public getReadInterface(inFile: string) {
        this.inStream = fs.createReadStream(inFile);
        return readline.createInterface({
            input: this.inStream
        });
    }

    public appendLine(line: string) {
        if (this.firstLine) {
            this.outStream.write(line);
            this.firstLine = false;
        } else {
            this.outStream.write(os.EOL + line);
        }
    }

    public async closeFiles(): Promise<void> {
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

    public getReadStream(): fs.ReadStream {
        return this.inStream;
    }

    public getWriteStream(): fs.WriteStream {
        return this.outStream;
    }

    private deleteFile(file: string) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`File: Deleted ${file}`);
        } else {
            console.log(`File: Did not delete ${file}, because it does not exist`);
        }
    }
}
