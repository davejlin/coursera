import os = require("os");
import { Parser } from "./Parser";
import { Keywords, Symbols, TokenType, quoteSymbol } from "./Constants";
import { Token } from "./Token";

export class JackTokenizer {
    public tokens: Token[] = [];
    constructor(private parser: Parser) {}

    public clearTokens() {
        this.tokens = [];
    }

    public tokenizeLine(line: string) {
        const lineTokens = this.parser.getTokens(line);
        if (lineTokens) {
            lineTokens.forEach(token => {
                if (token) {
                    const type = this.getType(token);
                    this.tokens.push(new Token(type, token));
                }
            })
        }
    }

    private getType(token: string): TokenType {
        if (this.isKeyword(token)) {
            return TokenType.keyword;
        }

        if (this.isSymbol(token)) {
            return TokenType.symbol;
        }

        if (this.isStringConstant(token)) {
            return TokenType.stringConstant;
        }

        if (this.isIntegerConstant(token)) {
            return TokenType.integerConstant;
        }

        if (this.isIdentifier(token)) {
            return TokenType.identifier;
        }

        return TokenType.unknown;
    }

    private isKeyword(token: string): boolean {
        return Keywords.includes(token);
    }

    private isSymbol(token: string): boolean {
        return Symbols.includes(token);
    }

    private isStringConstant(token: string): boolean {
        return token.charAt(0) === quoteSymbol && token.charAt(token.length-1) === quoteSymbol;
    }

    private isIntegerConstant(token: string): boolean {
        return !isNaN(Number(token));
    }

    private isIdentifier(token: string): boolean {
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token);
    }
}