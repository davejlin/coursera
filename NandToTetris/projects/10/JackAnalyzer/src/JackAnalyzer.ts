import { File } from "./File";
import { Main } from "./Main";
import { Parser } from "./Parser";
import { TokenStream } from "./TokenStream";

(async () => {
    try {
        const filename = process.argv[2];
        const file = new File();
        const parser = new Parser();
        const tokenStream = new TokenStream();
        const jackAnazyer = new Main(file, tokenStream, parser);
        await jackAnazyer.run(filename);
    } catch (error) {
        console.log(`Error ${error}`);
    }
})();
