// tslint:disable:variable-name
import "jest";
import { Parser } from "./Parser";
import { CommandType, DestMap } from "./Constants";

describe("Parser", () => {
    let parser: Parser;

    beforeEach(() => {
        parser = new Parser();
    });

    afterEach(() => {
        jest.clearAllMocks();
      });

    test("clean removes whitespace and inline comments", () => {
        const result = parser.clean("  dest    =     comp ; jump    // comment");
        expect.assertions(1);
        expect(result).toEqual("dest=comp;jump");
    });

    test("clean removes comments", () => {
        const result = parser.clean("// comment");
        expect.assertions(1);
        expect(result).toEqual("");
    });

    test("clean removes whitespace", () => {
        const result = parser.clean("     dest    =     comp     ;      jump   ");
        expect.assertions(1);
        expect(result).toEqual("dest=comp;jump");
    });

    test("clean retruns empty string for entire line of whitespace", () => {
        const result = parser.clean("                 ");
        expect.assertions(1);
        expect(result).toEqual("");
    });

    test("getCommandType A", () => {
        const result = parser.getCommandType("@xxx");
        expect.assertions(1);
        expect(result).toEqual(CommandType.A);
    });

    test("getCommandType L", () => {
        const result = parser.getCommandType("(xxx)");
        expect.assertions(1);
        expect(result).toEqual(CommandType.L);
    });

    test("getCommandType C", () => {
        let result = parser.getCommandType("dest=comp");
        expect.assertions(3);
        expect(result).toEqual(CommandType.C);

        result = parser.getCommandType("dest=comp;jump");
        expect(result).toEqual(CommandType.C);

        result = parser.getCommandType("comp;jump");
        expect(result).toEqual(CommandType.C);
    });

    test("getSymbol returns symbol for A type", () => {
        const result = parser.getSymbol("@123");
        expect.assertions(1);
        expect(result).toEqual("123");
    });

    test("getSymbol returns symbol for L type", () => {
        const result = parser.getSymbol("(123)");
        expect.assertions(1);
        expect(result).toEqual("123");
    });

    test("getDest returns dest", () => {
        let result = parser.getDest("COMP;JUMP");
        expect.assertions(2);
        expect(result).toEqual("");

        result = parser.getDest("DEST=COMP");
        expect(result).toEqual("DEST");
    });

    test("getComp returns comp", () => {
        let result = parser.getComp("DEST=COMP");
        expect.assertions(2);
        expect(result).toEqual("COMP");

        result = parser.getComp("COMP;JUMP");
        expect(result).toEqual("COMP");
    });

    test("getJump returns jump", () => {
        let result = parser.getJump("DEST=COMP");
        expect.assertions(2);
        expect(result).toEqual("");

        result = parser.getJump("COMP;JUMP");
        expect(result).toEqual("JUMP");
    });
});
