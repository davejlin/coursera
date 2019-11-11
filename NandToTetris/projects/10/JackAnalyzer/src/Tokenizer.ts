import { Keywords, Symbols, TokenType, quoteSymbol } from "./Constants";

export class Tokenizer {
    /**
     * Returns tokens
     * @param {string} line command line
     * @returns {string[]} array of tokens
     */
    public static getTokens(line: string): string[] {
        let cleanedLine = this.clean(line);
        return cleanedLine.match(/\w+|".*"|\S/g);
    }

    /**
     * Returns the token's type
     * @param token 
     */
    public static getType(token: string): TokenType {
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

    private static isKeyword(token: string): boolean {
        return Keywords.includes(token);
    }

    private static isSymbol(token: string): boolean {
        return Symbols.includes(token);
    }

    private static isStringConstant(token: string): boolean {
        return token.charAt(0) === quoteSymbol && token.charAt(token.length-1) === quoteSymbol;
    }

    private static isIntegerConstant(token: string): boolean {
        return !isNaN(Number(token));
    }

    private static isIdentifier(token: string): boolean {
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token);
    }

    /**
     * Cleans the command line:
     * Removes trailing and leading white spaces,
     * Removes comments
     * @param {string} line command line
     * @returns {string} command line without whitespaces or comments
     */
    private static clean(line: string): string {
        let cleanedLine = line.trim();
        cleanedLine = cleanedLine.replace(/\/\/.*$/g, ''); // to end of line comments
        cleanedLine = cleanedLine.replace(/\/\*[\s\S]*?\*\//g, ''); // inline /* */ comments
        cleanedLine = cleanedLine.replace(/^[\/\*].*$/g, ''); // API comments
        return cleanedLine.trim();
    }
}