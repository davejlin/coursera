import { Coder } from "./Coder";
import { Parser } from "./Parser";
import { commentSymbol, CommandType, spaceSymbol } from "./Constants";
import os = require("os");

export class Processor {
    constructor(
        private parser: Parser,
        private coder: Coder
    ) {}

    public init() {
        this.coder.init();
    }

    public process(line: string, filename: string): string {
        let processedLine = "";
        const cleanLine = this.parser.clean(line);
        if (cleanLine) {
            processedLine += `${commentSymbol} ${cleanLine}${os.EOL}`;
            const { commandType, command, arg1, arg2 } = this.parser.parse(line);
            if (commandType === CommandType.arithmetic) {
                processedLine += this.coder.writeArithmetic(command);
            } else if (commandType === CommandType.pop || commandType === CommandType.push) {
                processedLine += this.coder.writePushPop(command, arg1, arg2, filename);
            }
        }
        return processedLine;
    }
}
