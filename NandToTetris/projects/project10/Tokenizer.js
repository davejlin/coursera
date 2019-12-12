"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
class Tokenizer {
    /**
     * Returns tokens
     * @param {string} line command line
     * @returns {string[]} array of tokens
     */
    static getTokens(line) {
        let cleanedLine = this.clean(line);
        return cleanedLine.match(/\w+|".*"|\S/g);
    }
    /**
     * Returns the token's type
     * @param token
     */
    static getType(token) {
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
    static isKeyword(token) {
        return Constants_1.Keywords.includes(token);
    }
    static isSymbol(token) {
        return Constants_1.Symbols.includes(token);
    }
    static isStringConstant(token) {
        return token.charAt(0) === Constants_1.quoteSymbol && token.charAt(token.length - 1) === Constants_1.quoteSymbol;
    }
    static isIntegerConstant(token) {
        return !isNaN(Number(token));
    }
    static isIdentifier(token) {
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token);
    }
    /**
     * Cleans the command line:
     * Removes trailing and leading white spaces,
     * Removes comments
     * @param {string} line command line
     * @returns {string} command line without whitespaces or comments
     */
    static clean(line) {
        let cleanedLine = line.trim();
        cleanedLine = cleanedLine.replace(/\/\/.*$/g, ''); // to end of line comments
        cleanedLine = cleanedLine.replace(/\/\*[\s\S]*?\*\//g, ''); // inline /* */ comments
        cleanedLine = cleanedLine.replace(/^[\/\*].*$/g, ''); // API comments
        return cleanedLine.trim();
    }
}
exports.Tokenizer = Tokenizer;
