import { injectable } from "inversify";
import { CommandType } from "./Constants";

@injectable()
export class Parser {
    private commentSymbol = "//";
    private atSymbol = "@";
    private parenthesisSymbol = "(";
    private equalSymbol = "=";
    private semicolonSymbol = ";";

    /**
     * Cleans the command line:
     * Removes white spaces,
     * Removes comments
     * @param {string} line command line
     * @returns {string} command line without whitespaces or comments
     */
    public clean(line: string): string {
        const lineWithoutSpaces = line.replace(/\s/g, "");
        const indexOfComment = lineWithoutSpaces.indexOf(this.commentSymbol);
        if (indexOfComment === -1) {
            return lineWithoutSpaces;
        } else if (indexOfComment === 0) {
            return "";
        }
        return lineWithoutSpaces.split(this.commentSymbol)[0];
    }

    /**
     * Returns command type:
     * A for @xxx where xxx is either a symbol or a decimal number,
     * L for (xxx) where xxx is a symbol
     * C for dest=comp;jump
     * @param {string} line command line
     * @returns {CommandType} command type: A, C, L
     */
    public getCommandType(line: string): CommandType {
        const indexOfAt = line.indexOf(this.atSymbol);
        if (indexOfAt !== -1) {
            return CommandType.A;
        }
        const indexOfParenthesis = line.indexOf(this.parenthesisSymbol);
        if (indexOfParenthesis !== -1) {
            return CommandType.L;
        }
        return CommandType.C;
    }

    /**
     * Returns the symbol or decimal xxx of the current command @xxx or (xxx)
     * Should be called only when command type is A or L
     * @param {string} line command line
     * @returns {string} symbol xxx
     */
    public getSymbol(line: string): string {
        return line.replace(/[@()]/g, "");
    }

    /**
     * Returns the dest mnemonic in the inputted C command
     * Should be called only when command type is C
     * @param {string} line command line
     * @returns {string} dest
     */
    public getDest(line: string): string {
        const indexOfEqual = line.indexOf(this.equalSymbol);
        if (indexOfEqual === -1) {
            return "";
        }
        return line.split(this.equalSymbol)[0].toUpperCase();
    }

    /**
     * Returns the comp mnemonic in the inputted C command
     * Should be called only when command type is C
     * @param {string} line command line
     * @returns {string} comp
     */
    public getComp(line: string): string {
        const indexOfEqual = line.indexOf(this.equalSymbol);
        if (indexOfEqual === -1) {
            return line.split(this.semicolonSymbol)[0].toUpperCase();
        }
        return line.split(this.equalSymbol)[1].toUpperCase();
    }

    /**
     * Returns the jump mnemonic in the inputted C command
     * Should be called only when command type is C
     * @param {string} line command line
     * @returns {string} jum[]
     */
    public getJump(line: string): string {
        const indexOfSemicolon = line.indexOf(this.semicolonSymbol);
        if (indexOfSemicolon === -1) {
            return "";
        }
        return line.split(this.semicolonSymbol)[1].toUpperCase();
    }
}
