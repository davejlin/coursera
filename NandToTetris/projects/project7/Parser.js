"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
class Parser {
    /**
     * Cleans the command line:
     * Removes white spaces,
     * Removes comments
     * @param {string} line command line
     * @returns {string} command line without whitespaces or comments
     */
    clean(line) {
        const indexOfComment = line.indexOf(Constants_1.commentSymbol);
        if (indexOfComment === -1) {
            return line.trim();
        }
        else if (indexOfComment === 0) {
            return Constants_1.emptySymbol;
        }
        return line.split(Constants_1.commentSymbol)[0].trim();
    }
    parse(line) {
        const tokens = line.split(Constants_1.spaceSymbol);
        return ({
            commandType: this.commandType(tokens),
            command: this.command(tokens),
            arg1: this.arg1(tokens),
            arg2: this.arg2(tokens)
        });
    }
    /**
     * Returns the CommandType representing the type of the current command.
     * CommandType.arithmetic is returned for all the arithmetic/logical commands.
     * @param tokens
     */
    commandType(tokens) {
        return Constants_1.CommandTypeMap[this.command(tokens)];
    }
    /**
     * Returns the current command.
     * @param tokens
     */
    command(tokens) {
        return tokens[0];
    }
    /**
     * Returns the first argument of the current command.
     * In the case of CommandType.arithmetic, the command type itself (add, sub, etc) is returned.
     * Returns empty string if the current command is CommandType.return
     * @param line
     */
    arg1(tokens) {
        const commandType = this.commandType(tokens);
        if (commandType === Constants_1.CommandType.return || tokens.length === 0) {
            return Constants_1.emptySymbol;
        }
        if (commandType === Constants_1.CommandType.arithmetic) {
            return tokens[0];
        }
        if (tokens.length > 1) {
            return tokens[1];
        }
        return Constants_1.emptySymbol;
    }
    /**
     *  Returns the second argument of the current command for
     *  CommandTypes push, pop, function, or call.
     *  Returns empty string for any other command type.
     * @param line
     */
    arg2(tokens) {
        const commandType = this.commandType(tokens);
        if (tokens.length > 2 &&
            (commandType === Constants_1.CommandType.pop ||
                commandType === Constants_1.CommandType.push ||
                commandType === Constants_1.CommandType.function ||
                commandType === Constants_1.CommandType.call)) {
            return tokens[2];
        }
        return Constants_1.emptySymbol;
    }
}
exports.Parser = Parser;
