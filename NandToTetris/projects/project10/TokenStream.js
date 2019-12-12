"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("./Token");
const Tokenizer_1 = require("./Tokenizer");
const os = require("os");
/**
 * TokenStream provides a stream of tokens one at a time.
 * The input file is read and tokenized one line at a time.
 * Processing is paused until the current line's tokens have been completely consumed.
 */
class TokenStream {
    constructor(readStream) {
        this.readStream = readStream;
        this.readStreamOpen = true;
        this.tokens = [];
        this.hasNext = () => this.tokens.length > 0;
    }
    async init() {
        return new Promise(resolve => {
            this.readStream.on('readable', async () => {
                resolve();
            });
            this.readStream.on('end', () => {
                this.readStreamOpen = false;
                console.log(`TokenStream: ${this.readStream.path} end`);
            });
            this.readStream.on('error', error => {
                console.log(`TokenStream: ${this.readStream.path} error: ${error}`);
            });
        });
    }
    deinit() {
        this.readStream.removeAllListeners();
        this.readStream.close();
        this.readStream.destroy();
    }
    hasNextToken() {
        this.resumeReadingConditionally();
        return this.hasNext();
    }
    /**
     * Returns the next token and removes it from the tokens collection.
     * FIFO
     */
    getNext() {
        if (this.hasNextToken()) {
            const nextToken = this.tokens.splice(0, 1)[0];
            return nextToken;
        }
        return undefined;
    }
    /**
     * Returns the next token and keeps it in the tokens collection
     */
    peekNext() {
        if (this.hasNextToken()) {
            return this.tokens[0];
        }
        return undefined;
    }
    process(line) {
        const lineTokens = Tokenizer_1.Tokenizer.getTokens(line);
        if (lineTokens) {
            lineTokens.forEach(async (aToken) => {
                if (aToken) {
                    const type = Tokenizer_1.Tokenizer.getType(aToken);
                    const token = new Token_1.Token(type, aToken); // the next token
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
    resumeReadingConditionally() {
        if (this.readStreamOpen && this.tokens.length === 0) {
            this.read();
        }
    }
    /**
     * Reads and tokenizes the input file a single line at a time
     */
    read() {
        let line = "";
        while (true) {
            const newChar = this.readStream.read(1);
            if (newChar === null) { // end of file
                break;
            }
            if (newChar === os.EOL) { // end of line
                if (this.process(line)) {
                    break; // new tokens were created in the processed line, so stop processing more for now
                }
                line = ""; // no tokens in the processed line, so re-init for the next line
            }
            else {
                line += newChar;
            }
        }
    }
}
exports.TokenStream = TokenStream;
