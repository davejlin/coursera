import { injectable, inject } from "inversify";
import { TYPES } from "./di/types";
import { Parser } from "./Parser";
import { Code } from "./Code";
import { CommandType } from "./Constants";
import { SymbolTable } from "./SymbolTable";

@injectable()
export class Processor {
    private lineNumber = 0;
    private memoryAddress = 16;

    constructor(
        @inject(TYPES.Code) private code: Code,
        @inject(TYPES.Parse) private parser: Parser,
        @inject(TYPES.SymbolTable) private symbolTable: SymbolTable
    ) {
        this.init();
    }

    /**
     * Initializes properties
     */
    public init() {
        this.lineNumber = 0;
        this.memoryAddress = 16;
        this.symbolTable.init();
    }

    /**
     * Fill symbol table
     */
    public fillSymbolTable(line: string): void {
        const cleanLine = this.parser.clean(line);
        if (cleanLine) {
            const commandType = this.parser.getCommandType(cleanLine);
            const symbol = this.parser.getSymbol(cleanLine);
            if (commandType === CommandType.L) {
                if (!this.symbolTable.contains(symbol)) {
                    this.symbolTable.addEntry(symbol, this.lineNumber);
                }
                this.lineNumber -= 1;
                // console.log(` --- ${cleanLine}`);
            } else {
                // console.log(`${this.lineNumber} ${cleanLine}`);
            }
            this.lineNumber += 1;
        }
    }

    /**
     * Processes command line from symbolic machine language to binary assembly
     * @param line command line
     */
    public process(line: string): string {
        const cleanLine = this.parser.clean(line);
        if (cleanLine) {
            const commandType = this.parser.getCommandType(cleanLine);
            if (commandType === CommandType.C) {
                const dest = this.code.getDest(this.parser.getDest(cleanLine));
                const comp = this.code.getComp(this.parser.getComp(cleanLine));
                const jump = this.code.getJump(this.parser.getJump(cleanLine));
                return "111" + comp + dest + jump;
            } else {
                if (commandType === CommandType.A) {
                    const symbol = this.parser.getSymbol(cleanLine);
                    const numberSymbol = Number(symbol);
                    if (Number.isNaN(numberSymbol)) {
                        if (this.symbolTable.contains(symbol)) {
                            return this.code.addressToBinary(this.symbolTable.getAddress(symbol));
                        } else {
                            this.symbolTable.addEntry(symbol, this.memoryAddress);
                            const result = this.code.addressToBinary(this.memoryAddress);
                            this.memoryAddress += 1;
                            return result;
                        }
                    } else {
                        return this.code.addressToBinary(+numberSymbol);
                    }
                }
            }
        }
    }
}
