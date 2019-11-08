import { TokenType } from "./Constants";
import os = require("os");

export class Token {
    constructor(public type: TokenType, public token: string) {}

    public composeTag() {
        switch (this.type) {
            case TokenType.keyword:
                return this.createTag(TokenType.keyword, this.token);
            case TokenType.symbol:
                return this.createTag(TokenType.symbol, this.substituteSymbol(this.token));
            case TokenType.integerConstant:
                return this.createTag(TokenType.integerConstant, this.token);
            case TokenType.stringConstant:
                return this.createTag(TokenType.stringConstant, this.token.slice(1,-1));
            case TokenType.identifier:
                return this.createTag(TokenType.identifier, this.token);
            default:
                return this.createTag(TokenType.unknown, this.token);
        }
    }

    private createTag(tagname: string, token: string): string {
        return `<${tagname}> ${token} </${tagname}>` + os.EOL;
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