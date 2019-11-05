import os = require("os");
import { Parser } from "./Parser";
import { Keywords, Symbols, TokenType, quoteSymbol } from "./Constants";

export class JackTokenizer {
    constructor(private parser: Parser) {}

    public tokenizeLine(line: string): string {
        let returnString = "";
        const tokens = this.parser.getTokens(line);
        if (tokens) {
            let first = true;
            tokens.forEach(token => {
                let phrase = "";

                if (first) {
                    first = false;
                } else {
                    returnString += os.EOL;
                }

                if (token) {
                    const type = this.getType(token);
                    phrase = this.composeTag(type, token);

                    
                    returnString += phrase;
                }
            })
        }
        return returnString;
    }

    private composeTag(type: TokenType, token: string) {
        switch (type) {
            case TokenType.keyword:
                return this.createTag(TokenType.keyword, token);
            case TokenType.symbol:
                return this.createTag(TokenType.symbol, this.substituteSymbol(token));
            case TokenType.integerConstant:
                return this.createTag(TokenType.integerConstant, token);
            case TokenType.stringConstant:
                return this.createTag(TokenType.stringConstant, token.slice(1,-1));
            case TokenType.identifier:
                return this.createTag(TokenType.identifier, token);
            default:
                return this.createTag(TokenType.unknown, token);
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

    private createTag(tagname: string, token: string): string {
        return `<${tagname}> ${token} </${tagname}>`;
    }

    private substituteSymbol(token: string): string {
        switch (token) {
            case "<": return "&lt;";
            case ">": return "&gt;";
            case "\"": return "&quot;";
            case "&": return "&amp;";
            default: return token
        }
    }
}