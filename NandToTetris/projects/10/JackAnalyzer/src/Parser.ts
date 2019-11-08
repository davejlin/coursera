import { Token } from "./Token";
import os = require("os");

export class Parser {
    private writeLine: (string: string) => Promise<void>;
    constructor() {}

    public async init(writeLine: (string: string) => Promise<void>): Promise<void> {
        this.writeLine = writeLine;
        await this.writeLine(`<class>` + os.EOL);
    }

    public async nextToken(token: Token) {
        await this.compileClass(token);
    };

    public async deinit(): Promise<void> {
        await this.writeLine(`</class>` + os.EOL);
    }

    /**
     * Generates output of compiled Jack code in xml format
     */
    public async compile(token: Token): Promise<void> {
        await this.compileClass(token);
    }

    private async compileClass(token: Token): Promise<void> {
        await this.writeLine(token.composeTag());

    }
}
