import { File } from "./File";
import { Main } from "./Main";

(async () => {
    try {
        const filename = process.argv[2];
        const file = new File();
        const jackAnazyer = new Main(file);
        await jackAnazyer.run(filename);
    } catch (error) {
        console.log(`Error ${error}`);
    }
})();
