import { SymbolKind } from "./Constants";

export class Symbol {
    constructor(public name: string, public type: string, public kind: SymbolKind, public index: number) {}
}