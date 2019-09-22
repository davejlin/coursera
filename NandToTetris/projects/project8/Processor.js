"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
const os = require("os");
class Processor {
    constructor(parser, coder) {
        this.parser = parser;
        this.coder = coder;
        this.currentFunctionName = "";
    }
    init() {
        this.coder.init();
        this.currentFunctionName = "";
        return this.coder.writeBootstrap();
    }
    process(line, filename) {
        let processedLine = "";
        const cleanLine = this.parser.clean(line);
        if (cleanLine) {
            processedLine += `${Constants_1.commentSymbol} ${cleanLine}${os.EOL}`;
            const { commandType, command, arg1, arg2 } = this.parser.parse(line);
            switch (commandType) {
                case Constants_1.CommandType.arithmetic:
                    processedLine += this.coder.writeArithmetic(command, filename);
                    break;
                case Constants_1.CommandType.pop:
                case Constants_1.CommandType.push:
                    processedLine += this.coder.writePushPop(command, arg1, arg2, filename);
                    break;
                case Constants_1.CommandType.label:
                    processedLine += this.coder.writeLabel(arg1, this.currentFunctionName);
                    break;
                case Constants_1.CommandType.goto:
                    processedLine += this.coder.writeGoto(arg1, this.currentFunctionName);
                    break;
                case Constants_1.CommandType.ifgoto:
                    processedLine += this.coder.writeIfGoto(arg1, this.currentFunctionName);
                    break;
                case Constants_1.CommandType.function:
                    this.currentFunctionName = arg1;
                    processedLine += this.coder.writeFunction(this.currentFunctionName, arg2);
                    break;
                case Constants_1.CommandType.call:
                    processedLine += this.coder.writeCall(arg1, arg2, filename);
                    break;
                case Constants_1.CommandType.return:
                    processedLine += this.coder.writeReturn();
                    break;
            }
        }
        return processedLine;
    }
}
exports.Processor = Processor;
