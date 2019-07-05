// tslint:disable:variable-name
import "jest";
import { Code } from "./Code";
import { CompMap, DestMap, JumpMap } from "./Constants";

describe("Code", () => {
    let code: Code;

    beforeEach(() => {
        code = new Code();
    });

    afterEach(() => {
        jest.clearAllMocks();
      });

    test("getDest returns dest", () => {
        let input = "";
        let result = code.getDest(input);
        expect.assertions(8);
        expect(result).toEqual(DestMap[input]);

        input = "M";
        result = code.getDest(input);
        expect(result).toEqual(DestMap[input]);

        input = "D";
        result = code.getDest(input);
        expect(result).toEqual(DestMap[input]);

        input = "MD";
        result = code.getDest(input);
        expect(result).toEqual(DestMap[input]);

        input = "A";
        result = code.getDest(input);
        expect(result).toEqual(DestMap[input]);

        input = "AM";
        result = code.getDest(input);
        expect(result).toEqual(DestMap[input]);

        input = "AD";
        result = code.getDest(input);
        expect(result).toEqual(DestMap[input]);

        input = "AMD";
        result = code.getDest(input);
        expect(result).toEqual(DestMap[input]);
    });

    test("getComp returns comp", () => {
        let input = "0";
        let result = code.getComp(input);
        expect.assertions(3);
        expect(result).toEqual(CompMap[input]);

        input = "M";
        result = code.getComp(input);
        expect(result).toEqual(CompMap[input]);

        input = "D-M";
        result = code.getComp(input);
        expect(result).toEqual(CompMap[input]);
    });

    test("getJump returns jump", () => {
        let input = "";
        let result = code.getJump(input);
        expect.assertions(8);
        expect(result).toEqual(JumpMap[input]);

        input = "JGT";
        result = code.getJump(input);
        expect(result).toEqual(JumpMap[input]);

        input = "JEQ";
        result = code.getJump(input);
        expect(result).toEqual(JumpMap[input]);

        input = "JGE";
        result = code.getJump(input);
        expect(result).toEqual(JumpMap[input]);

        input = "JLT";
        result = code.getJump(input);
        expect(result).toEqual(JumpMap[input]);

        input = "JNE";
        result = code.getJump(input);
        expect(result).toEqual(JumpMap[input]);

        input = "JLE";
        result = code.getJump(input);
        expect(result).toEqual(JumpMap[input]);

        input = "JMP";
        result = code.getJump(input);
        expect(result).toEqual(JumpMap[input]);
    });

    test("addressToBinary converts address to binary", () => {
        let input = 0;
        expect.assertions(6);
        let result = code.addressToBinary(input);
        expect(result).toEqual("0000000000000000");

        input = 1;
        result = code.addressToBinary(input);
        expect(result).toEqual("0000000000000001");

        input = 2;
        result = code.addressToBinary(input);
        expect(result).toEqual("0000000000000010");

        input = 3;
        result = code.addressToBinary(input);
        expect(result).toEqual("0000000000000011");

        input = 258;
        result = code.addressToBinary(input);
        expect(result).toEqual("0000000100000010");

        input = 16383;
        result = code.addressToBinary(input);
        expect(result).toEqual("0011111111111111");
    });

    test("expect addressToBinary to throw error if input exceeds maximum allowed address", () => {
        const input = 32768;
        expect.assertions(1);
        try {
            code.addressToBinary(input);
        } catch (error) {
            expect(error.toString()).toBe(`Error: ${input} exceeds allowed maximum address value`);
        }
    });
});
