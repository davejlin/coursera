import os = require("os");
import { Parser } from "./Parser";

export class JackTokenizer {
    constructor(private parser: Parser) {}

    public tokenizeLine(line: string): string {
        let returnString = "";
        const cleanLine = this.parser.clean(line);
        returnString = cleanLine;
        return returnString;
    }
}