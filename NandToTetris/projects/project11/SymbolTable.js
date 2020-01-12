"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
const Symbol_1 = require("./Symbol");
const os = require("os");
class SymbolTable {
    constructor() {
        this.classTable = new Map();
        this.subroutineTable = new Map();
        this.fieldIndex = 0;
        this.staticIndex = 0;
        this.argumentIndex = 0;
        this.varIndex = 0;
        this.startClass();
        this.startSubroutine();
    }
    /**
     * Starts a new subroutine scope (i.e. resets the subroutine's symbol table)
     */
    startSubroutine() {
        this.subroutineTable.clear();
        this.argumentIndex = 0;
        this.varIndex = 0;
    }
    /**
     * Starts a new class scope (i.e. resets the class's symbol table)
     */
    startClass() {
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
    define(name, type, kind) {
        switch (kind) {
            case Constants_1.SymbolKind.field:
                if (this.classTable.has(name)) {
                    return;
                }
                const symbolField = new Symbol_1.Symbol(name, type, kind, this.fieldIndex++);
                this.classTable.set(symbolField.name, symbolField);
                break;
            case Constants_1.SymbolKind.static:
                if (this.classTable.has(name)) {
                    return;
                }
                const symbolStatic = new Symbol_1.Symbol(name, type, kind, this.staticIndex++);
                this.classTable.set(symbolStatic.name, symbolStatic);
                break;
            case Constants_1.SymbolKind.arg:
                if (this.subroutineTable.has(name)) {
                    return;
                }
                const symbolArg = new Symbol_1.Symbol(name, type, kind, this.argumentIndex++);
                this.subroutineTable.set(symbolArg.name, symbolArg);
                break;
            case Constants_1.SymbolKind.var:
                if (this.subroutineTable.has(name)) {
                    return;
                }
                const symbolVar = new Symbol_1.Symbol(name, type, kind, this.varIndex++);
                this.subroutineTable.set(symbolVar.name, symbolVar);
                break;
        }
    }
    /**
     * Returns the number of variables of the given kind already defined in the current scope
     * @param kind
     */
    varCount(kind) {
        switch (kind) {
            case Constants_1.SymbolKind.field:
                return this.fieldIndex;
            case Constants_1.SymbolKind.static:
                return this.staticIndex;
            case Constants_1.SymbolKind.arg:
                return this.argumentIndex;
            case Constants_1.SymbolKind.var:
                return this.varIndex;
        }
    }
    /**
     * Returns kind of the named identifier in the current scope.
     * @param name
     */
    kindOf(name) {
        const symbol = this.getSymbol(name);
        return symbol ? symbol.kind : undefined;
    }
    /**
     * Returns the type of the names identifier in the current scope.
     * @param name
     */
    typeOf(name) {
        const symbol = this.getSymbol(name);
        return symbol ? symbol.type : undefined;
    }
    /**
     * Returns the index assigned to the named identifier.
     * @param name
     */
    indexOf(name) {
        const symbol = this.getSymbol(name);
        return symbol ? symbol.index : undefined;
    }
    /**
     * Returns the symbol of the named identifier or undefined if it does not exist.
     * The subroutine's scope is checked first, and if not found, the class' scope is checked next.
     * @param name
     */
    getSymbol(name) {
        let symbol = this.subroutineTable.get(name);
        if (symbol == null) {
            symbol = this.classTable.get(name);
        }
        return symbol;
    }
    /**
     * outputs the composed tag of an entry in the symbol table
     */
    async composeTag(name, output, incrementSpacer, decrementSpacer) {
        const symbol = this.getSymbol(name);
        if (symbol == undefined) {
            await output([`<symbolTableEntry> undefined </symbolTableEntry>` + os.EOL]);
            return;
        }
        await output([`<symbolTableEntry>` + os.EOL]);
        incrementSpacer();
        await output([`<kind> ${symbol.kind} </kind>` + os.EOL, `<type> ${symbol.type} </type>` + os.EOL, `<name> ${symbol.name} </name>` + os.EOL, `<index> ${symbol.index} </index>` + os.EOL]);
        decrementSpacer();
        await output([`</symbolTableEntry>` + os.EOL]);
    }
}
exports.SymbolTable = SymbolTable;
