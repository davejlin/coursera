// tslint:disable:variable-name
import "jest";
import { SymbolTable } from "./SymbolTable";
import { SymbolTableBase } from "./Constants";

describe("Processor", () => {
    let symbolTable: SymbolTable;

    beforeEach(() => {
        symbolTable = new SymbolTable();
    });

    afterEach(() => {
        jest.clearAllMocks();
      });

    test("constructor should load base symbol table", () => {
        const numberOfKeys = Object.keys(SymbolTableBase).length;
        expect.assertions(numberOfKeys);

        for (const symbol in SymbolTableBase) {
            const receivedAddress = symbolTable.getAddress(symbol);
            const expectedAddress = SymbolTableBase[symbol];
            expect(receivedAddress).toEqual(expectedAddress);
        }
    });

    test("addEntry should add entry",  () => {
        const symbol = "symbol";
        const address = 123;
        symbolTable.addEntry(symbol, address);

        const receivedAddress = symbolTable.getAddress(symbol);

        expect.assertions(1);
        expect(receivedAddress).toEqual(address);
    });

    test("contains should return true if symbol exists in symbol table",  () => {
        const symbol = "symbol";
        const address = 123;
        symbolTable.addEntry(symbol, address);

        const result = symbolTable.contains(symbol);

        expect.assertions(1);
        expect(result).toEqual(true);
    });

    test("contains should return false if symbol does not exist in symbol table",  () => {
        const symbol = "symbol";
        const result = symbolTable.contains(symbol);

        expect.assertions(1);
        expect(result).toEqual(false);
    });
});
