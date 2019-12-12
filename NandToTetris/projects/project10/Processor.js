"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Processor {
    constructor(tokenStream, writeLine) {
        this.tokenStream = tokenStream;
        this.writeLine = writeLine;
    }
    async init() {
        await this.tokenStream.init();
    }
    async process() {
    }
    deinit() {
        this.tokenStream.deinit();
    }
}
exports.Processor = Processor;
