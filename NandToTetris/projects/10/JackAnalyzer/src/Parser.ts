import { Processor } from "./Processor";
import os = require("os");
import { Keyword, Symbol, spacer } from "./Constants";

export class Parser extends Processor {
    private spacer = "";
    /**
     * Compiles a complete class
     */
    public async process(): Promise<void> {
        this.resetSpacer();
        await this.output([`<class>` + os.EOL]);

        const classKeyword = this.tokenStream.getNext().composeTag();
        const name = this.tokenStream.getNext().composeTag();
        const openSymbol = this.tokenStream.getNext().composeTag();
        const output = [classKeyword, name, openSymbol];
        this.incrementSpacer();
        await this.output(output);

        while (this.tokenStream.hasNextToken()) {
            const peekNextToken = this.tokenStream.peekNext().token;
            switch (peekNextToken) {
                case Keyword.field:
                    await this.compileClassVarDec();
                    break;
                case Keyword.function:
                    await this.compileSubroutineDec();
                    break;
                default:
                    break;
            }
        }


        const closeSymbolToken = this.tokenStream.getNext().composeTag();
        this.decrementSpacer();
        await this.output([closeSymbolToken]);

        this.decrementSpacer();
        await this.output([`</class>` + os.EOL]);
    }s

    /**
     * Compiles a static declaration or a field declaration
     */
    private async compileClassVarDec(): Promise<void> {
        await this.output([`<classVarDec>` + os.EOL]);
        const keyword = this.tokenStream.getNext().composeTag();
        const type = this.tokenStream.getNext().composeTag();
        const name = this.tokenStream.getNext().composeTag();
        const symbol = this.tokenStream.getNext().composeTag();
        this.incrementSpacer();
        await this.output([keyword, type, name, symbol]);

        this.decrementSpacer();
        await this.output([`</classVarDec>` + os.EOL]);
    }

    /**
     * Compiles a declaration for a method, function, or constructor
     */
    private async compileSubroutineDec(): Promise<void> {
        await this.output([`<subroutineDec>` + os.EOL]);

        const functionKeyword = this.tokenStream.getNext().composeTag();
        const accessor = this.tokenStream.getNext().composeTag();
        const name = this.tokenStream.getNext().composeTag();
        const openParenths = this.tokenStream.getNext().composeTag();
        this.incrementSpacer();
        await this.output([functionKeyword, accessor, name, openParenths]);

        await this.compileParameterList();

        const closeParenths = this.tokenStream.getNext().composeTag();
        await this.output([closeParenths]);

        await this.compileSubroutineBody();

        this.decrementSpacer();
        await this.output([`</subroutineDec>` + os.EOL]);
    }

    /**
     * Compiles a (possibly empty) parameter list, not including the enclosing “()”
     */
    private async compileParameterList(): Promise<void> {
        await this.output([`<parameterList>` + os.EOL]);

        const output: string[] = [];
        while (this.tokenStream.peekNext().token !== Symbol.closeParenths) {
            const type = this.tokenStream.getNext().composeTag();
            const name = this.tokenStream.getNext().composeTag();
            output.push(type);
            output.push(name);
            const peekCommaSeparator = this.tokenStream.peekNext().token;
            if (peekCommaSeparator === Symbol.comma) {
                output.push(this.tokenStream.getNext().composeTag());
            }
        }

        this.incrementSpacer();
        await this.output(output);

        this.decrementSpacer();
        await this.output([`</parameterList>` + os.EOL]);
    }

    /**
     * Compiles the body of a method, function, or constructor
     */
    private async compileSubroutineBody(): Promise<void> {
        await this.output([`<subroutineBody>` + os.EOL]);

        const openBrace = this.tokenStream.getNext().composeTag();
        this.incrementSpacer();
        await this.output([openBrace]);

        while (this.tokenStream.peekNext().token !== Symbol.closeBrace) {
            switch (this.tokenStream.peekNext().token) {
                case Keyword.var:
                    await this.compileVarDec();
                default:
                    break;
            }
        }
        await this.output([`</subroutineBody>` + os.EOL]);
    }

    /**
     * Compiles a var declaration
     */
    private async compileVarDec(): Promise<void> {
        await this.output([`<varDec>` + os.EOL]);

        const varKeyword = this.tokenStream.getNext().composeTag();
        const type = this.tokenStream.getNext().composeTag();
        const name = this.tokenStream.getNext().composeTag();
        const output = [varKeyword, type, name];

        while (this.tokenStream.peekNext().token === Symbol.comma) {
            const comma = this.tokenStream.getNext().composeTag();
            const name = this.tokenStream.getNext().composeTag();
            output.push(comma)
            output.push(name);
        }

        const semicolon = this.tokenStream.getNext().composeTag();
        output.push(semicolon);
        this.incrementSpacer();
        await this.output(output);

        this.decrementSpacer();
        await this.output([`</varDec>` + os.EOL]);
    }

    /**
     * Compiles a sequence of statements, not including the enclosing “{}”
     */
    private async compileStatements(): Promise<void> {
        
    }

    /**
     * Compiles a let statement
     */
    private async compileLet(): Promise<void> {
        
    }

    /**
     * Compiles an if statement, possibly with a trailing else clause
     */
    private async compileIf(): Promise<void> {
        
    }

    /**
     * Compiles a while statement
     */
    private async compileWhile(): Promise<void> {
        
    }

    /**
     * Compiles a do statement
     */
    private async compileDo(): Promise<void> {
        
    }

    /**
     * Compiles a return statement
     */
    private async compileReturn(): Promise<void> {
        
    }

    /**
     * Compiles an expression
     */
    private async compileExpression(): Promise<void> {
        
    }

    /**
     * Compiles a term.  If the current token is an identifier,
     * the routine distinguishes between a variable, an array entry,
     * or a subroutine call.  A single look-ahead token, which may be
     * one of "["", "("", or "." suffices to distinguish between the
     * possibilities.  Any other token is not part of this term and
     * should not be advanced over 
     */
    private async compileTerm(): Promise<void> {
        
    }

    /**
     * Compiles a possibly empty comma-separated list of expressions
     */
    private async compileExpressionList(): Promise<void> {
        
    }

    private async output(output: string[]): Promise<void> {
        const outputLine = output.reduce((previousValue, _, currentIndex, array) => {
            return previousValue += this.spacer + array[currentIndex];
        }, "");

        if (outputLine.length > 0) {
            await this.writeLine(outputLine);
        }
    }

    private resetSpacer(): void {
        this.spacer = "";
    }

    private incrementSpacer(): void {
        this.spacer += spacer;
    }

    private decrementSpacer(): void {
        if (this.spacer.length > 0) {
            this.spacer = this.spacer.slice(0, -spacer.length);
        }
    }
}
