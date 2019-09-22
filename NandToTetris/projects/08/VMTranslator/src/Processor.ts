import { Coder } from "./Coder";
import { Parser } from "./Parser";
import { commentSymbol, CommandType, spaceSymbol } from "./Constants";
import os = require("os");

export class Processor {
    private currentFunctionName = "";

    constructor(
        private parser: Parser,
        private coder: Coder
    ) {}

    public init(): string {
        this.coder.init();
        this.currentFunctionName = "";
        return this.coder.writeBootstrap();
    }

    public process(line: string, filename: string): string {
        let processedLine = "";
        const cleanLine = this.parser.clean(line);
        if (cleanLine) {
            processedLine += `${commentSymbol} ${cleanLine}${os.EOL}`;
            const { commandType, command, arg1, arg2 } = this.parser.parse(line);
            switch(commandType) {
                case CommandType.arithmetic:
                    processedLine += this.coder.writeArithmetic(command);
                    break;
                case CommandType.pop:
                case CommandType.push:
                    processedLine += this.coder.writePushPop(command, arg1, arg2, filename);
                    break;
                case CommandType.label:
                    processedLine += this.coder.writeLabel(arg1, this.currentFunctionName);
                    break;
                case CommandType.goto:
                    processedLine += this.coder.writeGoto(arg1, this.currentFunctionName);
                    break;
                case CommandType.ifgoto:
                    processedLine += this.coder.writeIfGoto(arg1, this.currentFunctionName);
                    break;
                case CommandType.function:
                    this.currentFunctionName = arg1;
                    processedLine += this.coder.writeFunction(this.currentFunctionName, arg2);
                    break;
                case CommandType.call:
                    processedLine += this.coder.writeCall(arg1, arg2, filename);
                    break;
                case CommandType.return:
                    processedLine += this.coder.writeReturn();
                    break;
            }
        }
        return processedLine;
    }
}
