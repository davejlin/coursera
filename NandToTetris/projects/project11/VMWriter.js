"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const Constants_1 = require("./Constants");
class VMWriter {
    constructor(writeLine) {
        this.writeLine = writeLine;
    }
    /**
     * Writes a VM push command
     * @param segment
     * @param index
     */
    async writePush(segment, index) {
        await this.writeLine(`push ${segment} ${index}` + os.EOL);
    }
    /**
     * Writes a VM pop command
     * @param segment
     * @param index
     */
    async writePop(segment, index) {
        await this.writeLine(`pop ${segment} ${index}` + os.EOL);
    }
    /**
     * Writes a VM arithmetic-logical command
     * @param operator
     */
    async writeArithmetic(operator) {
        switch (operator) {
            case Constants_1.Symbol.plus:
                await this.writeLine(`add` + os.EOL);
                break;
            case Constants_1.Symbol.minus:
                await this.writeLine(`sub` + os.EOL);
                break;
            case Constants_1.Symbol.asterick:
                await this.writeLine(`call Math.multiply 2` + os.EOL);
                break;
            case Constants_1.Symbol.slash:
                await this.writeLine(`call Math.divide 2` + os.EOL);
                break;
            case Constants_1.Symbol.amperstand:
                await this.writeLine(`and` + os.EOL);
                break;
            case Constants_1.Symbol.pipe:
                await this.writeLine(`or` + os.EOL);
                break;
            case Constants_1.Symbol.lt:
                await this.writeLine(`lt` + os.EOL);
                break;
            case Constants_1.Symbol.gt:
                await this.writeLine(`gt` + os.EOL);
                break;
            case Constants_1.Symbol.eq:
                await this.writeLine(`eq` + os.EOL);
                break;
            case Constants_1.Command.neg:
                await this.writeLine(`neg` + os.EOL);
                break;
            case Constants_1.Command.not:
                await this.writeLine(`not` + os.EOL);
                break;
            default:
                await this.writeLine(`ERROR: UNKNOWN OPERATOR ${operator}` + os.EOL);
        }
    }
    /**
     * Writes a VM label command
     * @param label
     */
    async writeLabel(label) {
        await this.writeLine(`label ${label}` + os.EOL);
    }
    /**
     * Writes a VM goto command
     * @param label
     */
    async writeGoto(label) {
        await this.writeLine(`goto ${label}` + os.EOL);
    }
    /**
     * Writes a VM if-goto command
     * @param label
     */
    async writeIf(label) {
        await this.writeLine(`if-goto ${label}` + os.EOL);
    }
    /**
     * Writes a VM call command
     * @param name
     * @param nArgs
     */
    async writeCall(name, nArgs) {
        await this.writeLine(`call ${name} ${nArgs}` + os.EOL);
    }
    /**
     * Writes a VM function command
     * @param name
     * @param nArgs
     */
    async writeFunction(name, nArgs) {
        await this.writeLine(`function ${name} ${nArgs}` + os.EOL);
    }
    /**
     * Writes a VMW return command
     */
    async writeReturn() {
        await this.writeLine(`return` + os.EOL);
    }
    /**
     * Closes the output file
     */
    close() {
    }
}
exports.VMWriter = VMWriter;
