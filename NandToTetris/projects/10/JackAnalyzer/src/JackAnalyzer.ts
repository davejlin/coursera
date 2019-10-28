import { File } from "./File";
import { Main } from "./Main";
import { Parser } from "./Parser";
import { JackTokenizer } from "./JackTokenizer";

(async () => {
    try {
        const filename = process.argv[2];
        const file = new File();
        const parser = new Parser();
        const tokenizer = new JackTokenizer(parser);
        const jackAnazyer = new Main(file, tokenizer);
        await jackAnazyer.run(filename);
    } catch (error) {
        console.log(`Error ${error}`);
    }
})();
