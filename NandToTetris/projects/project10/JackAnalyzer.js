"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("./Main");
(async () => {
    try {
        const filename = process.argv[2];
        const jackAnazyer = new Main_1.Main();
        await jackAnazyer.run(filename);
    }
    catch (error) {
        console.log(`Error ${error}`);
    }
})();
