import { Main } from "./Main";

(async () => {
    try {
        const filename = process.argv[2];
        const jackAnazyer = new Main();
        await jackAnazyer.run(filename);
    } catch (error) {
        console.log(`Error ${error}`);
    }
})();
