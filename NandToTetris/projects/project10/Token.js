"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
const os = require("os");
class Token {
    constructor(type, token) {
        this.type = type;
        this.token = token;
    }
    composeTag() {
        switch (this.type) {
            case Constants_1.TokenType.keyword:
                return this.createTag(Constants_1.TokenType.keyword, this.token);
            case Constants_1.TokenType.symbol:
                return this.createTag(Constants_1.TokenType.symbol, this.substituteSymbol(this.token));
            case Constants_1.TokenType.integerConstant:
                return this.createTag(Constants_1.TokenType.integerConstant, this.token);
            case Constants_1.TokenType.stringConstant:
                return this.createTag(Constants_1.TokenType.stringConstant, this.token.slice(1, -1));
            case Constants_1.TokenType.identifier:
                return this.createTag(Constants_1.TokenType.identifier, this.token);
            default:
                return this.createTag(Constants_1.TokenType.unknown, this.token);
        }
    }
    createTag(tagname, token) {
        return `<${tagname}> ${token} </${tagname}>` + os.EOL;
    }
    substituteSymbol(token) {
        switch (token) {
            case "<": return "&lt;";
            case ">": return "&gt;";
            case "\"": return "&quot;";
            case "&": return "&amp;";
            default: return token;
        }
    }
}
exports.Token = Token;
