import { injectable, inject } from "inversify";
import { SymbolTableBase } from "./Constants";

@injectable()
export class SymbolTable {
    private symbolTable: { [key: string]: number } = {};
    constructor() {
        this.init();
    }

    /**
     * Initializes symbol table with base values
     */
    public init() {
        this.symbolTable = {};
        for (const symbol in SymbolTableBase) {
            this.symbolTable[symbol] = SymbolTableBase[symbol];
        }
    }

    /**
     * Adds symbol and address (base 10) to SymbolTable
     * @param {string} symbol
     * @param {number} address base 10
     */
    public addEntry(symbol: string, address: number): void {
        this.symbolTable[symbol] = address;
    }

    /**
     * Checks to see if the symbol is in the SymbolTable
     * @param {string} symbol
     */
    public contains(symbol: string): boolean {
        return symbol in this.symbolTable;
    }

    /**
     * Returns the base 10 address corresponding to the symbol
     * @param {string} symbol
     * @returns {number} base 10 address corresponding to symbol
     */
    public getAddress(symbol: string): number {
        return this.symbolTable[symbol];
    }
}
