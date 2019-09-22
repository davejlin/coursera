import { commentSymbol, CommandType, CommandTypeMap, spaceSymbol, emptySymbol } from "./Constants";

export class Parser {
    /**
     * Cleans the command line:
     * Removes white spaces,
     * Removes comments
     * @param {string} line command line
     * @returns {string} command line without whitespaces or comments
     */
    public clean(line: string): string {
        const indexOfComment = line.indexOf(commentSymbol);
        if (indexOfComment === -1) {
            return line.trim();
        } else if (indexOfComment === 0) {
            return emptySymbol;
        }
        return line.split(commentSymbol)[0].trim();
    }

    public parse(line: string) {
        const tokens = line.split(spaceSymbol);
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
    public commandType(tokens: string[]): CommandType {
        return CommandTypeMap[this.command(tokens)];
    }

    /**
     * Returns the current command.
     * @param tokens
     */
    public command(tokens: string[]): string {
        return tokens[0];
    }

    /**
     * Returns the first argument of the current command.
     * In the case of CommandType.arithmetic, the command type itself (add, sub, etc) is returned.
     * Returns empty string if the current command is CommandType.return
     * @param line
     */
    public arg1(tokens: string[]): string {
        const commandType = this.commandType(tokens);
        if (commandType === CommandType.return || tokens.length === 0) {
            return emptySymbol;
        }
        if (commandType === CommandType.arithmetic) {
            return tokens[0];
        }
        if (tokens.length > 1) {
            return tokens[1];
        }
        return emptySymbol;
    }

    /**
     *  Returns the second argument of the current command for
     *  CommandTypes push, pop, function, or call.
     *  Returns empty string for any other command type.
     * @param line
     */
    public arg2(tokens: string[]): string {
        const commandType = this.commandType(tokens);

        if (tokens.length > 2 &&
            (
                commandType === CommandType.pop ||
                commandType === CommandType.push ||
                commandType === CommandType.function ||
                commandType === CommandType.call
            )
         ) {
            return tokens[2];
        }

        return emptySymbol;
    }
}
