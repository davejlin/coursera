import { TokenStream } from "./TokenStream";
import { Processor } from "./Processor";
import os = require("os");

export class TokenWriter extends Processor {

    public async process(): Promise<void> {
        await this.writeLine(`<tokens>` + os.EOL);
        while(this.tokenStream.hasNextToken()) {
            const token = this.tokenStream.getNext();
            await this.writeLine(token.composeTag());
        }
        await this.writeLine(`</tokens>` + os.EOL);
    }
}
