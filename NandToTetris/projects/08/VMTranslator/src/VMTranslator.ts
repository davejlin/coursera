import { Main } from "./Main";
import { File } from "./File";
import { Processor } from "./Processor";
import { Parser } from "./Parser";
import { Coder } from "./Coder";

(async () => {
    try {
        const filename = process.argv[2];
        const file = new File();
        const parser = new Parser();
        const coder = new Coder();
        const processor = new Processor(parser, coder);
        const vmTranslator = new Main(file, processor);
        await vmTranslator.run(filename);
    } catch (error) {
        console.log(`Error ${error}`);
    }
})();
