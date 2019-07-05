import { injectable } from "inversify";
import { CompMap, DestMap, JumpMap } from "./Constants";

@injectable()
export class Code {
    public getDest(dest: string): string {
        return DestMap[dest];
    }

    public getComp(comp: string): string {
        return CompMap[comp];
    }

    public getJump(jump: string): string {
        return JumpMap[jump];
    }

    /**
     * Converts an address to its 15 digit binary form
     * @param {number} address
     * @returns {string} 15 digit binary form of the address
     */
    public addressToBinary(address: number): string {
        let result = "";
        let quotient = address;
        let remainder = 0;

        if (quotient > 32767) {
            throw new Error(`${quotient} exceeds allowed maximum address value`);
        }

        do {
            [quotient, remainder] = this.divide(quotient, 2);
            result = remainder + result;
        } while (quotient !== 0);

        result = this.fillZeros(result, 16);
        return result;
    }

    private divide(dividend: number, divisor: number): number[] {
        const quotient = Math.floor(dividend / divisor);
        const remainder = dividend % divisor;
        return [quotient, remainder];
    }

    private fillZeros(value: string, maxDigits: number): string {
        let result = value;
        const zero = "0";
        for (let i = value.length; i < maxDigits; i += 1) {
            result = zero + result;
        }
        return result;
    }
}
