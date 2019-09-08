"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
const os = require("os");
class Processor {
    constructor(parser, coder) {
        this.parser = parser;
        this.coder = coder;
    }
    init() {
        this.coder.init();
    }
    process(line, filename) {
        let processedLine = "";
        const cleanLine = this.parser.clean(line);
        if (cleanLine) {
            processedLine += `${Constants_1.commentSymbol} ${cleanLine}${os.EOL}`;
            const { commandType, command, arg1, arg2 } = this.parser.parse(line);
            if (commandType === Constants_1.CommandType.arithmetic) {
                processedLine += this.coder.writeArithmetic(command);
            }
            else if (commandType === Constants_1.CommandType.pop || commandType === Constants_1.CommandType.push) {
                processedLine += this.coder.writePushPop(command, arg1, arg2, filename);
            }
        }
        return processedLine;
    }
}
exports.Processor = Processor;
