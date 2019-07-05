// tslint:disable:variable-name
import "jest";
import { Code } from "./Code";
import { Parser } from "./Parser";
import { Processor } from "./Processor";
import { SymbolTable } from "./SymbolTable";
import { CommandType } from "./Constants";

const line = "some line";
const symbol = "some symbol";
const symbolTableValue = "some symbol table value";
const binaryValue = "some binary value";

const MockCode = jest.fn<Code>(() => ({
    init: jest.fn(),
    addressToBinary: jest.fn().mockReturnValue(binaryValue),
    appendLine: jest.fn(),
    getReadInterface: jest.fn().mockReturnValue({ on: jest.fn() })
}));

const MockParser = jest.fn<Parser>(() => ({
    clean: jest.fn().mockReturnValue(line),
    getDest: jest.fn(),
    getComp: jest.fn(),
    getJump: jest.fn(),
    getCommandType: jest.fn(),
    getSymbol: jest.fn().mockReturnValue(symbol)
}));

const MockSymbolTable = jest.fn<SymbolTable>(() => ({
    init: jest.fn(),
    addEntry: jest.fn(),
    contains: jest.fn().mockReturnValue(false),
    getAddress: jest.fn().mockReturnValue(symbolTableValue)
}));

describe("Processor", () => {
    let mockCode: Code;
    let mockParser: Parser;
    let mockSymbolTable: SymbolTable;
    let processor: Processor;

    beforeEach(() => {
        mockCode = new MockCode();
        mockParser = new MockParser();
        mockSymbolTable = new MockSymbolTable();
        processor = new Processor(mockCode, mockParser, mockSymbolTable);
    });

    afterEach(() => {
        jest.clearAllMocks();
      });

    test("fillSymbolTable adds a L type label symbol and instruction line number", () => {
        mockParser.getCommandType = jest.fn().mockReturnValue(CommandType.L);

        processor.fillSymbolTable(line);

        expect.assertions(1);
        expect(mockSymbolTable.addEntry).toBeCalledWith(symbol, 0);
    });

    test("fillSymbolTable increments instruction line number for each addition of L type variable symbol", () => {
        // Note: mocked version always returns false for contains of the same input symbol
        // In practice, once added, the same input symbol would not be added
        // This is just to test whether the instruction line number is incremented properly
        mockParser.getCommandType = jest.fn()
            .mockReturnValueOnce(CommandType.L)
            .mockReturnValueOnce(CommandType.A)
            .mockReturnValueOnce(CommandType.L)
            .mockReturnValueOnce(CommandType.A)
            .mockReturnValueOnce(CommandType.L);

        processor.fillSymbolTable(line);
        processor.fillSymbolTable(line);
        processor.fillSymbolTable(line);
        processor.fillSymbolTable(line);
        processor.fillSymbolTable(line);

        expect.assertions(3);
        expect(mockSymbolTable.addEntry).toBeCalledWith(symbol, 0);
        expect(mockSymbolTable.addEntry).toBeCalledWith(symbol, 1);
        expect(mockSymbolTable.addEntry).toBeCalledWith(symbol, 2);
    });

    test("fillSymbolTable does not add a L type symbol to symbol table if its entry already exists", () => {
        mockSymbolTable.contains = jest.fn().mockReturnValue(true);
        mockParser.getCommandType = jest.fn().mockReturnValue(CommandType.L);

        processor.fillSymbolTable(line);

        expect.assertions(1);
        expect(mockSymbolTable.addEntry).not.toBeCalled();
    });

    test("fillSymbolTable does not do anything is line is not clean", () => {
        mockParser.clean = jest.fn().mockReturnValue(undefined);
        mockParser.getCommandType = jest.fn().mockReturnValue(CommandType.L);

        processor.fillSymbolTable(line);

        expect.assertions(1);
        expect(mockParser.getCommandType).not.toBeCalled();
    });

    test("fillSymbolTable ignores A type instructions", () => {
        mockParser.getCommandType = jest.fn().mockReturnValue(CommandType.A);

        processor.fillSymbolTable(line);

        expect.assertions(1);
        expect(mockSymbolTable.addEntry).not.toBeCalled();
    });

    test("fillSymbolTable ignores C type instructions", () => {
        mockParser.getCommandType = jest.fn().mockReturnValue(CommandType.C);

        processor.fillSymbolTable(line);

        expect.assertions(1);
        expect(mockSymbolTable.addEntry).not.toBeCalled();
    });

    test("process adds an A type variable symbol and memory address", () => {
        mockParser.getCommandType = jest.fn().mockReturnValue(CommandType.A);

        const result = processor.process(line);

        expect.assertions(2);
        expect(mockSymbolTable.addEntry).toBeCalledWith(symbol, 16);
        expect(result).toEqual(binaryValue);
    });

    test("process increments memory address for each addition of A type variable symbol", () => {
        // Note: mocked version always returns false for contains of the same input symbol
        // In practice, once added, the same input symbol would not be added
        // This is just to test whether the memory address is incremented properly
        mockParser.getCommandType = jest.fn().mockReturnValue(CommandType.A);

        processor.process(line);
        processor.process(line);
        processor.process(line);

        expect.assertions(3);
        expect(mockSymbolTable.addEntry).toBeCalledWith(symbol, 16);
        expect(mockSymbolTable.addEntry).toBeCalledWith(symbol, 17);
        expect(mockSymbolTable.addEntry).toBeCalledWith(symbol, 18);
    });

    test("process does not add an A type symbol to symbol table if its entry already exists", () => {
        mockSymbolTable.contains = jest.fn().mockReturnValue(true);
        mockParser.getCommandType = jest.fn().mockReturnValue(CommandType.A);

        const result = processor.process(line);

        expect.assertions(2);
        expect(mockSymbolTable.addEntry).not.toBeCalled();
        expect(result).toEqual(binaryValue);
    });

    test("process does not add an A type symbol to symbol table if is a numberical address", () => {
        mockParser.getSymbol = jest.fn().mockReturnValue("123");
        mockParser.getCommandType = jest.fn().mockReturnValue(CommandType.A);

        const result = processor.process(line);

        expect.assertions(2);
        expect(mockSymbolTable.addEntry).not.toBeCalled();
        expect(result).toEqual(binaryValue);
    });

    test("process processes a C type command", () => {
        mockCode.getDest = jest.fn().mockReturnValue("dest-");
        mockCode.getComp = jest.fn().mockReturnValue("-comp-");
        mockCode.getJump = jest.fn().mockReturnValue("jump");
        mockParser.getCommandType = jest.fn().mockReturnValue(CommandType.C);

        const result = processor.process(line);

        expect.assertions(1);
        expect(result).toEqual("111-comp-dest-jump");
    });

    test("process ignores L type instructions", () => {
        mockParser.getCommandType = jest.fn().mockReturnValue(CommandType.L);

        const result = processor.process(line);

        expect.assertions(1);
        expect(result).toBe(undefined);
    });

    test("process returns undefined if not a clean line", () => {
        mockParser.clean = jest.fn().mockReturnValue(undefined);
        const result = processor.process(line);
        expect.assertions(1);
        expect(result).toBe(undefined);
    });
});
