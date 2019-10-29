import os = require("os");
import { Parser } from "./Parser";

export class JackTokenizer {
    constructor(private parser: Parser) {}

    public tokenizeLine(line: string): string {
        let returnString = "";
        const tokens = this.parser.getTokens(line);
        if (tokens) {
            tokens.forEach(token => {
                if (token) {
                    returnString += "<" + token + ">";
                }
            })
        }
        return returnString;
    }
}