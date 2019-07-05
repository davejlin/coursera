import { TYPES } from "./di/types";
import { Assembler } from "./Assembler";
import { DefaultContainer } from "./di/inversify.config";

(async () => {
    try {
        const files = [ "../add/Add", "../max/Max", "../pong/Pong", "../rect/Rect"];
        const container = new DefaultContainer();
        const assembler = container.instance.get<Assembler>(TYPES.Assembler);
        await assembler.run(files);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();
