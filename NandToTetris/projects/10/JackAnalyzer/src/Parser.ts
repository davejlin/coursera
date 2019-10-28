import { commentSymbolType1, commentSymbolType2, spaceSymbol, emptySymbol } from "./Constants";

export class Parser {
    /**
     * Cleans the command line:
     * Removes trailing and leading white spaces,
     * Removes comments
     * @param {string} line command line
     * @returns {string} command line without whitespaces or comments
     */
    public clean(line: string): string {
        let cleanedLine = line.trim();
        cleanedLine = cleanedLine.replace(/\/\/.*$/g, ''); // to end of line comments
        cleanedLine = cleanedLine.replace(/\/\*[\s\S]*?\*\//g, ''); // inline /* */ comments
        cleanedLine = cleanedLine.replace(/^[\/\*].*$/g, ''); // API comments
        return cleanedLine.trim();
    }
}
