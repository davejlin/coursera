// tslint:disable:variable-name
import "jest";
import fs = require("fs");
import os = require("os");
import { File } from "./File";

jest.mock("fs");
jest.mock("readline");

describe("File", () => {
    let file: File;

    beforeEach(() => {
        file = new File();
    });

    afterEach(() => {
        jest.clearAllMocks();
      });

    test("init initializes file system", async () => {
        const outFile = "outFile";
        await file.init(outFile);
        expect.assertions(1);
        expect(fs.createWriteStream).toBeCalledWith(outFile, { flags: "a" });
    });

    test("getReadInterface gets fs readInterface", async () => {
        const inFile = "inFile";
        file.getReadInterface(inFile);
        expect.assertions(1);
        expect(fs.createReadStream).toBeCalledWith(inFile);
    });

    test("appendLine writes to outstream", async () => {
        const line = "line";
        await file.init("outFile");
        file.appendLine(line);
        expect.assertions(1);
        expect(file.getWriteStream().write).toBeCalledWith(line);
    });

    test("appendLine adds linebreak to lines after the first append", async () => {
        const line = "line";
        await file.init("outFile");
        file.appendLine(line);
        file.appendLine(line);
        expect.assertions(1);
        expect(file.getWriteStream().write).toBeCalledWith(`${os.EOL}${line}`);
    });

    test("closeFiles closes files", async () => {
        await file.init("outFile");
        file.getReadInterface("inFile");
        await file.closeFiles();
        expect.assertions(2);
        expect(file.getReadStream().close).toBeCalledWith();
        expect(file.getWriteStream().close).toBeCalledWith();
    });

    test("deleteFile unlinks if file exists", async () => {
        const outFile = "outFile";
        await file.init(outFile);
        expect.assertions(1);
        expect(fs.unlinkSync).toBeCalledWith(outFile);
    });

    test("deleteFile does not unlink if file does not exist", async () => {
        fs.existsSync = jest.fn().mockReturnValue(false);
        const outFile = "outFile";
        await file.init(outFile);
        expect.assertions(1);
        expect(fs.unlinkSync).not.toBeCalledWith(outFile);
    });

    test("closeFiles closes files after both files are closed", async () => {
        fs.createWriteStream = jest.fn()
            .mockReturnValue(
                {
                    on: jest.fn().mockImplementation((command, cb) => {
                        if (command === "open") {
                            cb();
                        } else if (command === "close") {
                            setTimeout(() => {
                                cb();
                            }, 1);
                        }
                    }),
                    write: jest.fn(),
                    close: jest.fn()
                }
            );

        await file.init("outFile");
        file.getReadInterface("inFile");
        await file.closeFiles();
        expect.assertions(2);
        expect(file.getReadStream().close).toBeCalledWith();
        expect(file.getWriteStream().close).toBeCalledWith();
    });
});
