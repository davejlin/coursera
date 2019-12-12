"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
const Token_1 = require("./Token");
class JackTokenizer {
    constructor(parser) {
        this.parser = parser;
        this.tokens = [];
    }
    clearTokens() {
        this.tokens = [];
    }
    tokenizeLine(line) {
        const lineTokens = this.parser.getTokens(line);
        if (lineTokens) {
            lineTokens.forEach(token => {
                if (token) {
                    const type = this.getType(token);
                    this.tokens.push(new Token_1.Token(type, token));
                }
            });
        }
    }
    getType(token) {
        if (this.isKeyword(token)) {
            return Constants_1.TokenType.keyword;
        }
        if (this.isSymbol(token)) {
            return Constants_1.TokenType.symbol;
        }
        if (this.isStringConstant(token)) {
            return Constants_1.TokenType.stringConstant;
        }
        if (this.isIntegerConstant(token)) {
            return Constants_1.TokenType.integerConstant;
        }
        if (this.isIdentifier(token)) {
            return Constants_1.TokenType.identifier;
        }
        return Constants_1.TokenType.unknown;
    }
    isKeyword(token) {
        return Constants_1.Keywords.includes(token);
    }
    isSymbol(token) {
        return Constants_1.Symbols.includes(token);
    }
    isStringConstant(token) {
        return token.charAt(0) === Constants_1.quoteSymbol && token.charAt(token.length - 1) === Constants_1.quoteSymbol;
    }
    isIntegerConstant(token) {
        return !isNaN(Number(token));
    }
    isIdentifier(token) {
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token);
    }
}
exports.JackTokenizer = JackTokenizer;
