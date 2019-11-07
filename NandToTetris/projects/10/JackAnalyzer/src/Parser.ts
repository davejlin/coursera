import { Token } from "./Token";
import { File } from "./File";
import { WriteStream } from "fs";

export class Parser {
    /**
     * Generates output of compiled Jack code in xml format
     */
    public async compile(file: File, writeStream: WriteStream): Promise<void> {
        await this.compileClass(file, writeStream);
    }

    private async compileClass(file: File, writeStream: WriteStream): Promise<void> {
        await file.appendLine(`<class>`, writeStream);

        await file.appendLine(`</class>`, writeStream);
    }
}
