import { Processor } from "./Processor";
import os = require("os");

export class Parser extends Processor {

    public async process(): Promise<void> {
        await this.writeLine(`<class>` + os.EOL);
        while(this.tokenStream.hasNextToken()) {
            const token = this.tokenStream.nextToken();
            await this.writeLine(token.composeTag());
        }
        await this.writeLine(`</class>` + os.EOL);
    }
}
