import { File } from "./File";
import { Main } from "./Main";
import { Parser } from "./Parser";
import { Tokenizer } from "./Tokenizer";

(async () => {
    try {
        const filename = process.argv[2];
        const file = new File();
        const parser = new Parser();
        const tokenizer = new Tokenizer();
        const jackAnazyer = new Main(file, tokenizer, parser);
        await jackAnazyer.run(filename);
    } catch (error) {
        console.log(`Error ${error}`);
    }
})();
