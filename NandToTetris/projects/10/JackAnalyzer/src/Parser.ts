import { Processor } from "./Processor";
import os = require("os");
import { Keyword, Symbol, spacer, TokenType } from "./Constants";
import { Token } from "./Token";

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

        let cycle = true;
        while (cycle) {
            const peekNextToken = this.tokenStream.peekNext().token;
            switch (peekNextToken) {
                case Keyword.field:
                case Keyword.static:
                    await this.compileClassVarDec();
                    break;
                case Keyword.constructor:
                case Keyword.function:
                case Keyword.method:
                    await this.compileSubroutineDec();
                    if (this.tokenStream.peekNext().token === Symbol.closeBrace) {
                        cycle = false;
                    }
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
        await this.compileVars();
        await this.output([`</classVarDec>` + os.EOL]);
    }

    /**
     * Compiles a declaration for a method, function, or constructor
     */
    private async compileSubroutineDec(): Promise<void> {
        await this.output([`<subroutineDec>` + os.EOL]);

        const functionKeyword = this.tokenStream.getNext().composeTag();
        const accessor = this.tokenStream.getNext().composeTag();
        const output = [functionKeyword, accessor];

        while (this.tokenStream.peekNext().type == TokenType.identifier) {
            const identifier = this.tokenStream.getNext().composeTag();
            output.push(identifier);
        }

        const openParenths = this.tokenStream.getNext().composeTag();
        output.push(openParenths);

        this.incrementSpacer();
        await this.output(output);

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
        let cycle = true;
        await this.output([`<subroutineBody>` + os.EOL]);

        const openBrace = this.tokenStream.getNext().composeTag();
        this.incrementSpacer();
        await this.output([openBrace]);

        while (cycle) {
            switch (this.tokenStream.peekNext().token) {
                case Keyword.var:
                    await this.compileVarDec();
                    break;
                case Keyword.let:
                case Keyword.if:
                case Keyword.while:
                case Keyword.do:
                case Keyword.return:
                    await this.compileStatements();
                    cycle = false;
                default:
                    break;
            }
        }

        this.decrementSpacer();
        await this.output([`</subroutineBody>` + os.EOL]);
    }

    /**
     * Compiles a var declaration
     */
    private async compileVarDec(): Promise<void> {
        await this.output([`<varDec>` + os.EOL]);
        await this.compileVars();
        await this.output([`</varDec>` + os.EOL]);
    }

    private async compileVars(): Promise<void> {
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
    }

    /**
     * Compiles a sequence of statements, not including the enclosing “{}”
     */
    private async compileStatements(): Promise<void> {
        await this.output([`<statements>` + os.EOL]);
        this.incrementSpacer();

        while (this.tokenStream.peekNext().token != Symbol.closeBrace) {
            switch (this.tokenStream.peekNext().token) {
                case Keyword.let:
                    await this.compileLet();
                    break;
                case Keyword.if:
                    await this.compileIf();
                    break;
                case Keyword.while:
                    await this.compileWhile();
                    break;
                case Keyword.do:
                    await this.compileDo();
                    break;
                case Keyword.return:
                    await this.compileReturn();
                    break;
                default:
                    break;
            }
        }

        this.decrementSpacer();
        await this.output([`</statements>` + os.EOL])

        const closeBrace = this.tokenStream.getNext().composeTag();
        await this.output([closeBrace]);
    }

    /**
     * Compiles a let statement
     */
    private async compileLet(): Promise<void> {
        await this.output([`<letStatement>` + os.EOL]);
        this.incrementSpacer();

        const letKeyword = this.tokenStream.getNext().composeTag();
        await this.output([letKeyword]);

        await this.compileTerm();
        
        const equals = this.tokenStream.getNext().composeTag();
        await this.output([equals]);

        await this.compileExpression();

        const symbolSemicolon = this.tokenStream.getNext().composeTag();
        await this.output([symbolSemicolon]);

        this.decrementSpacer();
        await this.output([`</letStatement>` + os.EOL]);
    }

    /**
     * Compiles an if statement, possibly with a trailing else clause
     */
    private async compileIf(): Promise<void> {
        await this.output([`<ifStatement>` + os.EOL]);
        
        const ifKeyword = this.tokenStream.getNext().composeTag();
        const openPareths = this.tokenStream.getNext().composeTag();

        this.incrementSpacer();
        await this.output([ifKeyword, openPareths]);

        await this.compileExpression();

        const closeParenth = this.tokenStream.getNext().composeTag();
        const openBrace = this.tokenStream.getNext().composeTag();
        await this.output([closeParenth, openBrace]);

        await this.compileStatements();

        if (this.tokenStream.peekNext().token == Keyword.else) {
            const elseKeyword = this.tokenStream.getNext().composeTag();
            const openBrace = this.tokenStream.getNext().composeTag();
            await this.output([elseKeyword, openBrace]);
            await this.compileStatements();
        }

        this.decrementSpacer();
        await this.output([`</ifStatement>` + os.EOL]);
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
        await this.output([`<doStatement>` + os.EOL]);
        
        const doKeyword = this.tokenStream.getNext().composeTag();
        const identifier1 = this.tokenStream.getNext().composeTag();
        const output = [doKeyword, identifier1];

        if (this.tokenStream.peekNext().token === Symbol.period) {
            const symbol = this.tokenStream.getNext().composeTag();
            const identifier2 = this.tokenStream.getNext().composeTag();
            output.push(symbol);
            output.push(identifier2);
        }

        const openParenths = this.tokenStream.getNext().composeTag();
        output.push(openParenths);

        this.incrementSpacer();
        await this.output(output);

        await this.compileExpressionList();

        const closeParenths = this.tokenStream.getNext().composeTag();
        const symbolSemicolon = this.tokenStream.getNext().composeTag();
        await this.output([closeParenths, symbolSemicolon]);

        this.decrementSpacer();
        await this.output([`</doStatement>` + os.EOL]);
    }

    /**
     * Compiles a return statement
     */
    private async compileReturn(): Promise<void> {
        await this.output([`<returnStatement>` + os.EOL]);
        
        const returnKeyword = this.tokenStream.getNext().composeTag();

        this.incrementSpacer();
        await this.output([returnKeyword]);

        if (this.tokenStream.peekNext().token !== Symbol.semicolon) {
            await this.compileExpression();
        }

        const symbol = this.tokenStream.getNext().composeTag();
        await this.output([symbol]);

        this.decrementSpacer();
        await this.output([`</returnStatement>` + os.EOL]);
    }

    /**
     * Compiles an expression
     */
    private async compileExpression(): Promise<void> {
        await this.output([`<expression>` + os.EOL]);
        this.incrementSpacer();

        while (this.tokenStream.peekNext().token !== Symbol.semicolon 
        && this.tokenStream.peekNext().token !== Symbol.closeParenths
        && this.tokenStream.peekNext().token !== Symbol.closeBracket) {
            switch (this.tokenStream.peekNext().type) {
                case TokenType.identifier:
                    await this.output([`<term>` + os.EOL]);
                    await this.compileTerm();
                    await this.output([`</term>` + os.EOL]);
                    break;
                default:
                    await this.output([this.tokenStream.getNext().composeTag()]);
                    break;
            }
        }


        this.decrementSpacer();
        await this.output([`</expression>` + os.EOL]);
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
        const name = this.tokenStream.getNext().composeTag();

        this.incrementSpacer();
        await this.output([name]);
        
        switch (this.tokenStream.peekNext().token) {
            case Symbol.openBracket:
                await this.output([this.tokenStream.getNext().composeTag()]);
                await this.compileExpression();
                await this.output([this.tokenStream.getNext().composeTag()]);
                break;
            case Symbol.openParenths:
                break;
            case Symbol.period:
                break;
            default:
                break;
        }

        this.decrementSpacer();
    }

    /**
     * Compiles a possibly empty comma-separated list of expressions
     */
    private async compileExpressionList(): Promise<void> {
        await this.output([`<expressionList>` + os.EOL]);
        await this.output([`</expressionList>` + os.EOL]);
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
