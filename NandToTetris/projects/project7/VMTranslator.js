"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("./Main");
const File_1 = require("./File");
const Processor_1 = require("./Processor");
const Parser_1 = require("./Parser");
const Coder_1 = require("./Coder");
(async () => {
    try {
        const filename = process.argv[2];
        const file = new File_1.File();
        const parser = new Parser_1.Parser();
        const coder = new Coder_1.Coder();
        const processor = new Processor_1.Processor(parser, coder);
        const vmTranslator = new Main_1.Main(file, processor);
        await vmTranslator.run(filename);
    }
    catch (error) {
        console.log(`Error ${error}`);
    }
})();
