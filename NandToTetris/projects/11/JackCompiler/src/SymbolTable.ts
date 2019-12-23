import { SymbolKind } from "./Constants";
import { Symbol } from "./Symbol";

export class SymbolTable {
    private classTable = new Map<string, Symbol>();
    private subroutineTable = new Map<string, Symbol>();
    private fieldIndex = 0;
    private staticIndex = 0;
    private argumentIndex = 0;
    private varIndex = 0;

    constructor() {
        this.startClass();
        this.startSubroutine();
    }

    /**
     * Starts a new subroutine scope (i.e. resets the subroutine's symbol table)
     */
    public startSubroutine() {
        this.subroutineTable.clear();
        this.argumentIndex = 0;
        this.varIndex = 0;
    }

    /**
     * Starts a new class scope (i.e. resets the class's symbol table)
     */
    private startClass() {
        this.classTable.clear();
        this.fieldIndex = 0;
        this.staticIndex = 0;
    }

    /**
     * Defines a new identifier of the given name, type, and kind, and assigns it a running index
     * @param name 
     * @param type 
     * @param kind 
     */
    public define(name: string, type: string, kind: SymbolKind) {
        switch (kind) {
            case SymbolKind.field:
                if (this.classTable.has(name)) {
                    return;
                }
                const symbolField = new Symbol(name, type, kind, this.fieldIndex++);
                this.classTable.set(symbolField.name, symbolField);
                break;
            case SymbolKind.static:
                if (this.classTable.has(name)) {
                    return;
                }
                const symbolStatic = new Symbol(name, type, kind, this.staticIndex++);
                this.classTable.set(symbolStatic.name, symbolStatic);
                break;
            case SymbolKind.arg:
                if (this.subroutineTable.has(name)) {
                    return;
                }
                const symbolArg = new Symbol(name, type, kind, this.argumentIndex++);
                this.subroutineTable.set(symbolArg.name, symbolArg);
                break;
            case SymbolKind.var:
                if (this.subroutineTable.has(name)) {
                    return;
                }
                const symbolVar = new Symbol(name, type, kind, this.varIndex++);
                this.subroutineTable.set(symbolVar.name, symbolVar);
                break;
        }
    }

    /**
     * Returns the number of variables of the given kind already defined in the current scope
     * @param kind
     */
    public varCount(kind: SymbolKind): number {
        switch (kind) {
            case SymbolKind.field:
                return this.fieldIndex;
            case SymbolKind.static:
                return this.staticIndex;
            case SymbolKind.arg:
                return this.argumentIndex;
            case SymbolKind.var:
                return this.varIndex;
        }
    }

    /**
     * Returns kind of the named identifier in the current scope.
     * @param name
     */
    public kindOf(name: string): SymbolKind {
        const symbol = this.getSymbol(name);
        return symbol ? symbol.kind : undefined;
    }

    /**
     * Returns the type of the names identifier in the current scope.
     * @param name
     */
    public typeOf(name: string): string {
        const symbol = this.getSymbol(name);
        return symbol ? symbol.type : undefined;
    }

    /**
     * Returns the index assigned to the named identifier.
     * @param name
     */
    public indexOf(name: string): number {
        const symbol = this.getSymbol(name);
        return symbol ? symbol.index : undefined;
    }

    /**
     * Returns the symbol of the named identifier or undefined if it does not exist.
     * The subroutine's scope is checked first, and if not found, the class' scope is checked next.
     * @param name 
     */
    private getSymbol(name: string): Symbol {
        let symbol = this.subroutineTable.get(name);
        if (symbol == null) {
            symbol = this.classTable.get(name);
        }
        return symbol;
    }

}
