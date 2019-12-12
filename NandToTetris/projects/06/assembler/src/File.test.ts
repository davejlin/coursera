// tslint:disable:variable-name
import "jest";
import fs = require("fs");
import os = require("os");
import { File } from "./File";

jest.mock("fs");
jest.mock("readline");

const MockOutStream = jest.fn(() => ({
    close: jest.fn(),
    on: jest.fn().mockImplementation((_, cb) => {
        cb();
    }),
    write: jest.fn().mockImplementation((_, cb) => {
        cb();
    })
}));

describe("File", () => {
    let mockOutStream;
    let file: File;

    beforeEach(() => {
        mockOutStream = new MockOutStream();
        fs.createWriteStream = jest.fn().mockReturnValue(mockOutStream);
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
        await file.appendLine(line);
        expect.assertions(1);
        expect(file.getWriteStream().write).toBeCalledWith(line, expect.any(Function));
    });

    test("appendLine adds linebreak to lines after the first append", async () => {
        const line = "line";
        await file.init("outFile");
        await file.appendLine(line);
        await file.appendLine(line);
        expect.assertions(1);
        expect(file.getWriteStream().write).toBeCalledWith(`${os.EOL}${line}`, expect.any(Function));
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

    test("appendLine logs on error - first line", async () => {
        let mockLogArgument = "";
        const mockConsoleLog = log => mockLogArgument = log;
        console.log = mockConsoleLog;
        mockOutStream.write = jest.fn().mockImplementation((_, cb) => {
            cb("some error 1");
        });

        const line = "line";
        await file.init("outFile");
        await file.appendLine(line);
        expect.assertions(1);
        expect(mockLogArgument).toEqual(`File: appendLine error: some error 1`);
    });

    test("appendLine logs on error - after first line", async () => {
        let mockLogArgument = "";
        const mockConsoleLog = log => mockLogArgument = log;
        console.log = mockConsoleLog;
        mockOutStream.write = jest.fn()
        .mockImplementationOnce((_, cb) => {
            cb();
        })
        .mockImplementationOnce((_, cb) => {
            cb("some error 2");
        });

        const line = "line";
        await file.init("outFile");
        await file.appendLine(line);
        await file.appendLine(line);
        expect.assertions(1);
        expect(mockLogArgument).toEqual(`File: appendLine error: some error 2`);
    });
});
