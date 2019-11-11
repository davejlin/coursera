import { TokenStream } from "./TokenStream";

export abstract class Processor {
    constructor (protected tokenStream: TokenStream, protected writeLine: (string: string) => Promise<void>) {}

    public async init(): Promise<void> {
        await this.tokenStream.init();
    }

    public async process(): Promise<void> {
    }

    public deinit(): void {
        this.tokenStream.deinit();
    }
}