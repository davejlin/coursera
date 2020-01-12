"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("./Main");
(async () => {
    try {
        const filename = process.argv[2];
        const jackCompiler = new Main_1.Main();
        await jackCompiler.run(filename);
    }
    catch (error) {
        console.log(`Error ${error}`);
    }
})();
