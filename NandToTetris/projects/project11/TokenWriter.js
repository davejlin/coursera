"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Processor_1 = require("./Processor");
const os = require("os");
class TokenWriter extends Processor_1.Processor {
    async process() {
        await this.writeLine(`<tokens>` + os.EOL);
        while (this.tokenStream.hasNextToken()) {
            const token = this.tokenStream.getNext();
            await this.writeLine(token.composeTag());
        }
        await this.writeLine(`</tokens>` + os.EOL);
    }
}
exports.TokenWriter = TokenWriter;
