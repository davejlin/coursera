import { ReadStream } from "fs";
import { Token } from "./Token";
import { Tokenizer } from "./Tokenizer";

/**
 * TokenStream provides a stream of tokens one at a time.
 * The input file is read and tokenized one line at a time.
 * Processing is paused until the current line's tokens have been completely consumed.
 */
export class TokenStream {
    private readStream: ReadStream;
    private readStreamOpen = true;
    private tokens: Token[] = [];
    private hasNext = () => this.tokens.length > 0

    constructor() {}

    public async init(readStream: ReadStream): Promise<void> {
        this.readStream = readStream;
        return new Promise(resolve => {
            readStream.on('readable', async () => {
                resolve();
            });
    
            readStream.on('end', () => {
                this.readStreamOpen = false;
                console.log(`TokenStream: ${readStream.path} end`);
            });
    
            readStream.on('error', error => {
                console.log(`TokenStream: ${readStream.path} error: ${error}`);
            });
        });
    }

    public deinit() {
        this.readStream.removeAllListeners();
        this.readStream.close();
        this.readStream.destroy();
    }

    public hasNextToken(): boolean {
        this.resumeReadingConditionally();
        return this.hasNext();
    }

    public nextToken(): Token | undefined {
        if (this.hasNext()) {
            const nextToken = this.tokens.splice(0, 1)[0];
            return nextToken; 
        }
        return undefined;
    }

    private process(line: string): boolean {
        const lineTokens = Tokenizer.getTokens(line);
        if (lineTokens) {
            lineTokens.forEach(async aToken => {
                if (aToken) {
                    const type = Tokenizer.getType(aToken);
                    const token = new Token(type, aToken)  // the next token
                    this.tokens.push(token);
                }
            });
            return true;
        }
        return false;
    }

    /**
     * Resume reading the next line only if the stream is still open and there are no available tokens in the buffer
     */
    private resumeReadingConditionally(): void {
        if (this.readStreamOpen && this.tokens.length === 0) {
            this.read();
        }
    }

    /**
     * Reads and tokenizes the input file a single line at a time
     */
    private read(): void {
        let line = "";
        while (true) {
            const newChar = this.readStream.read(1);
            if (newChar === null) { // end of file
                break;
            }
            if (newChar === "\n") { // end of line
                if (this.process(line)) {
                    break;  // new tokens were created in the processed line, so stop processing more for now
                }
                line = ""; // no tokens in the processed line, so re-init for the next line
            } else {
                line += newChar;
            }
        }
    }
}