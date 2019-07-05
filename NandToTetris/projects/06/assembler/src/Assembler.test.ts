// tslint:disable:variable-name
import "jest";
import { Assembler } from "./Assembler";
import { File } from "./File";
import { Processor } from "./Processor";

const MockFile = jest.fn<File>(() => ({
    init: jest.fn(),
    appendLine: jest.fn(),
    closeFiles: jest.fn(),
    getReadInterface: jest.fn().mockReturnValue({ on: jest.fn().mockImplementation((_, cb) => {
        cb();
    })})
}));

const MockProcessor = jest.fn<Processor>(() => ({
    init: jest.fn(),
    fillSymbolTable: jest.fn().mockReturnValue(0),
    process: jest.fn().mockReturnValue({line: "line", memoryAddress: 16})
}));

const mockFilePath = "./mocks/file";

describe("Assembler", () => {
    let mockFile: File;
    let mockProcessor: Processor;
    let assembler: Assembler;

    beforeEach(() => {
        mockFile = new MockFile();
        mockProcessor = new MockProcessor();
        assembler = new Assembler(mockFile, mockProcessor);
    });

    afterEach(() => {
        jest.clearAllMocks();
      });

    test("run initializes File", async () => {
        await assembler.run([mockFilePath]);
        expect.assertions(1);
        expect(mockFile.init).toBeCalled();
    });

    test("run subscribes to on", async () => {
        await assembler.run([mockFilePath]);
        expect.assertions(2);
        expect(mockFile.getReadInterface("inputFile").on).toBeCalledWith("line", expect.any(Function));
        expect(mockFile.getReadInterface("inputFile").on).toBeCalledWith("close", expect.any(Function));
    });

    test("run fills symbol table", async () => {
        await assembler.run([mockFilePath]);
        expect.assertions(1);
        expect(mockProcessor.fillSymbolTable).toBeCalled();
    });

    test("run appends lines", async () => {
        await assembler.run([mockFilePath]);
        expect.assertions(1);
        expect(mockFile.appendLine).toBeCalled();
    });

    test("does not append lines with no valid commands", async () => {
        mockProcessor.process = jest.fn().mockReturnValue(undefined);
        await assembler.run([mockFilePath]);
        expect.assertions(1);
        expect(mockFile.appendLine).not.toBeCalled();
    });
});
