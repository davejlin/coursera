import { Main } from "./Main";

(async () => {
    try {
        const filename = process.argv[2];
        const jackCompiler = new Main();
        await jackCompiler.run(filename);
    } catch (error) {
        console.log(`Error ${error}`);
    }
})();
