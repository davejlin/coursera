"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Processor_1 = require("./Processor");
const os = require("os");
const Constants_1 = require("./Constants");
const SymbolTable_1 = require("./SymbolTable");
class Parser extends Processor_1.Processor {
    constructor() {
        super(...arguments);
        this.spacer = "";
    }
    /**
     * Compiles a complete class
     */
    async process() {
        this.symbolTable = new SymbolTable_1.SymbolTable();
        this.resetSpacer();
        await this.output([`<class>` + os.EOL]);
        const classKeyword = this.tokenStream.getNext();
        const name = this.tokenStream.getNext();
        const openSymbol = this.tokenStream.getNext();
        const output = [classKeyword.composeTag(), name.composeTag(), openSymbol.composeTag()];
        this.incrementSpacer();
        await this.output(output);
        let cycle = true;
        while (cycle) {
            const peekNextToken = this.tokenStream.peekNext().token;
            switch (peekNextToken) {
                case Constants_1.Keyword.field:
                case Constants_1.Keyword.static:
                    await this.compileClassVarDec();
                    break;
                case Constants_1.Keyword.constructor:
                case Constants_1.Keyword.function:
                case Constants_1.Keyword.method:
                    await this.compileSubroutineDec(name.token);
                    if (this.tokenStream.peekNext().token === Constants_1.Symbol.closeBrace) {
                        cycle = false;
                    }
                    break;
                default:
                    break;
            }
        }
        const closeSymbolToken = this.tokenStream.getNext().composeTag();
        await this.output([closeSymbolToken]);
        this.decrementSpacer();
        await this.output([`</class>` + os.EOL]);
    }
    /**
     * Compiles a static declaration or a field declaration
     */
    async compileClassVarDec() {
        await this.output([`<classVarDec>` + os.EOL]);
        await this.compileVars();
        await this.output([`</classVarDec>` + os.EOL]);
    }
    /**
     * Compiles a declaration for a method, function, or constructor
     */
    async compileSubroutineDec(className) {
        this.startSymbolTableForSubroutine(className);
        await this.output([`<subroutineDec>` + os.EOL]);
        const functionKeyword = this.tokenStream.getNext().composeTag();
        const returnType = this.tokenStream.getNext().composeTag();
        const output = [functionKeyword, returnType];
        if (this.tokenStream.peekNext().type === Constants_1.TokenType.identifier) {
            const methodName = this.tokenStream.getNext().composeTag();
            output.push(methodName);
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
    async compileParameterList() {
        await this.output([`<parameterList>` + os.EOL]);
        this.incrementSpacer();
        while (this.tokenStream.peekNext().token !== Constants_1.Symbol.closeParenths) {
            const type = this.tokenStream.getNext();
            const name = this.tokenStream.getNext();
            await this.output([type.composeTag(), name.composeTag()]);
            await this.defineSymbolTableEntry(name.token, type.token, Constants_1.SymbolKind.arg);
            const peekCommaSeparator = this.tokenStream.peekNext().token;
            if (peekCommaSeparator === Constants_1.Symbol.comma) {
                const comma = this.tokenStream.getNext().composeTag();
                await this.output([comma]);
            }
        }
        this.decrementSpacer();
        await this.output([`</parameterList>` + os.EOL]);
    }
    /**
     * Compiles the body of a method, function, or constructor
     */
    async compileSubroutineBody() {
        let cycle = true;
        await this.output([`<subroutineBody>` + os.EOL]);
        const openBrace = this.tokenStream.getNext().composeTag();
        this.incrementSpacer();
        await this.output([openBrace]);
        while (cycle) {
            switch (this.tokenStream.peekNext().token) {
                case Constants_1.Keyword.var:
                    await this.compileVarDec();
                    break;
                default:
                    cycle = false;
                    break;
            }
        }
        await this.compileStatements();
        this.decrementSpacer();
        await this.output([`</subroutineBody>` + os.EOL]);
    }
    /**
     * Compiles a var declaration
     */
    async compileVarDec() {
        await this.output([`<varDec>` + os.EOL]);
        await this.compileVars();
        await this.output([`</varDec>` + os.EOL]);
    }
    async compileVars() {
        const varKeyword = this.tokenStream.getNext();
        const type = this.tokenStream.getNext();
        this.incrementSpacer();
        await this.output([varKeyword.composeTag(), type.composeTag()]);
        while (true) {
            const name = this.tokenStream.getNext();
            await this.output([name.composeTag()]);
            await this.defineSymbolTableEntry(name.token, type.token, Constants_1.SymbolKind[varKeyword.token]);
            if (this.tokenStream.peekNext().token === Constants_1.Symbol.comma) {
                const comma = this.tokenStream.getNext();
                await this.output([comma.composeTag()]);
            }
            else {
                break;
            }
        }
        const semicolon = this.tokenStream.getNext().composeTag();
        await this.output([semicolon]);
        this.decrementSpacer();
    }
    /**
     * Compiles a sequence of statements, not including the enclosing “{}”
     */
    async compileStatements() {
        await this.output([`<statements>` + os.EOL]);
        this.incrementSpacer();
        while (this.tokenStream.peekNext().token != Constants_1.Symbol.closeBrace) {
            switch (this.tokenStream.peekNext().token) {
                case Constants_1.Keyword.let:
                    await this.compileLet();
                    break;
                case Constants_1.Keyword.if:
                    await this.compileIf();
                    break;
                case Constants_1.Keyword.while:
                    await this.compileWhile();
                    break;
                case Constants_1.Keyword.do:
                    await this.compileDo();
                    break;
                case Constants_1.Keyword.return:
                    await this.compileReturn();
                    break;
                default:
                    break;
            }
        }
        this.decrementSpacer();
        await this.output([`</statements>` + os.EOL]);
        const closeBrace = this.tokenStream.getNext().composeTag();
        await this.output([closeBrace]);
    }
    /**
     * Compiles a let statement
     */
    async compileLet() {
        await this.output([`<letStatement>` + os.EOL]);
        this.incrementSpacer();
        const letKeyword = this.tokenStream.getNext().composeTag();
        const name = this.tokenStream.getNext();
        await this.output([letKeyword, name.composeTag()]);
        const symbolTableEntry = await this.getSymbolTableEntry(name);
        if (symbolTableEntry.type === Constants_1.SymbolType.array) {
            await this.compileArray();
        }
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
    async compileIf() {
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
        if (this.tokenStream.peekNext().token === Constants_1.Keyword.else) {
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
    async compileWhile() {
        await this.output([`<whileStatement>` + os.EOL]);
        const whileKeyword = this.tokenStream.getNext().composeTag();
        const openPareths = this.tokenStream.getNext().composeTag();
        this.incrementSpacer();
        await this.output([whileKeyword, openPareths]);
        await this.compileExpression();
        const closeParenth = this.tokenStream.getNext().composeTag();
        const openBrace = this.tokenStream.getNext().composeTag();
        await this.output([closeParenth, openBrace]);
        await this.compileStatements();
        this.decrementSpacer();
        await this.output([`</whileStatement>` + os.EOL]);
    }
    /**
     * Compiles a do statement
     */
    async compileDo() {
        await this.output([`<doStatement>` + os.EOL]);
        const doKeyword = this.tokenStream.getNext().composeTag();
        const identifier = this.tokenStream.getNext().composeTag();
        let methodName = "";
        this.incrementSpacer();
        await this.output([doKeyword, identifier]);
        if (this.tokenStream.peekNext().token === Constants_1.Symbol.period) {
            methodName = await this.compileMethodCall();
        }
        const nElements = await this.compileExpressionList();
        const semicolon = this.tokenStream.getNext().composeTag();
        await this.output([semicolon]);
        this.decrementSpacer();
        await this.output([`</doStatement>` + os.EOL]);
    }
    /**
     * Compiles a return statement
     */
    async compileReturn() {
        await this.output([`<returnStatement>` + os.EOL]);
        const returnKeyword = this.tokenStream.getNext().composeTag();
        this.incrementSpacer();
        await this.output([returnKeyword]);
        if (this.tokenStream.peekNext().token !== Constants_1.Symbol.semicolon) {
            await this.compileExpression();
        }
        const semiColon = this.tokenStream.getNext().composeTag();
        await this.output([semiColon]);
        this.decrementSpacer();
        await this.output([`</returnStatement>` + os.EOL]);
    }
    /**
     * Compiles an expression
     */
    async compileExpression() {
        await this.output([`<expression>` + os.EOL]);
        let nElements = 1;
        let firstPass = true;
        let peekNextToken = this.tokenStream.peekNext();
        while (!Constants_1.ExpressionTerminators.includes(peekNextToken.token)) {
            switch (peekNextToken.type) {
                case Constants_1.TokenType.symbol:
                    if (firstPass && (peekNextToken.token === Constants_1.Symbol.minus || peekNextToken.token === Constants_1.Symbol.tilda)) {
                        await this.compileTerm();
                    }
                    else if (peekNextToken.token === Constants_1.Symbol.openParenths) {
                        await this.compileTerm();
                    }
                    else if (peekNextToken.token === Constants_1.Symbol.comma) {
                        nElements += 1;
                        const comma = this.tokenStream.getNext().composeTag();
                        await this.output([`</expression>` + os.EOL]);
                        await this.output([comma]);
                        await this.output([`<expression>` + os.EOL]);
                        firstPass = true;
                    }
                    else {
                        const symbol = this.tokenStream.getNext().composeTag();
                        this.incrementSpacer();
                        await this.output([symbol]);
                        this.decrementSpacer();
                    }
                    break;
                default:
                    await this.compileTerm();
                    peekNextToken = this.tokenStream.peekNext();
                    if (Constants_1.Operators.includes(peekNextToken.token)) {
                        const symbol = this.tokenStream.getNext().composeTag();
                        this.incrementSpacer();
                        await this.output([symbol]);
                        this.decrementSpacer();
                        await this.compileTerm();
                    }
                    break;
            }
            peekNextToken = this.tokenStream.peekNext();
            firstPass = false;
        }
        await this.output([`</expression>` + os.EOL]);
        return nElements;
    }
    /**
     * Compiles a term.  If the current token is an identifier,
     * the routine distinguishes between a variable, an array entry,
     * or a subroutine call.  A single look-ahead token, which may be
     * one of "["", "("", or "." suffices to distinguish between the
     * possibilities.  Any other token is not part of this term and
     * should not be advanced over
     */
    async compileTerm() {
        this.incrementSpacer();
        await this.output([`<term>` + os.EOL]);
        const peekNextToken = this.tokenStream.peekNext().token;
        switch (peekNextToken) {
            case Constants_1.Symbol.minus:
            case Constants_1.Symbol.tilda:
                const symbol = this.tokenStream.getNext().composeTag();
                this.incrementSpacer();
                await this.output([symbol]);
                this.decrementSpacer();
                await this.compileTerm();
                this.incrementSpacer();
                break;
            case Constants_1.Symbol.openParenths:
                const openPareths = this.tokenStream.getNext().composeTag();
                this.incrementSpacer();
                await this.output([openPareths]);
                await this.compileExpression();
                const closeParenths = this.tokenStream.getNext().composeTag();
                await this.output([closeParenths]);
                break;
            default:
                const name = this.tokenStream.getNext();
                this.incrementSpacer();
                await this.output([name.composeTag()]);
                switch (this.tokenStream.peekNext().token) {
                    case Constants_1.Symbol.period:
                        await this.compileMethodCall();
                        await this.compileExpressionList();
                        break;
                    case Constants_1.Symbol.openBracket:
                        await this.compileArray();
                    // fall through
                    default:
                        const symbolTableEntry = await this.getSymbolTableEntry(name);
                        break;
                }
                break;
        }
        this.decrementSpacer();
        await this.output([`</term>` + os.EOL]);
        this.decrementSpacer();
    }
    /**
     * Compiles a possibly empty comma-separated list of expressions
     */
    async compileExpressionList() {
        let nElements = 0;
        const openParenths = this.tokenStream.getNext().composeTag();
        await this.output([openParenths, `<expressionList>` + os.EOL]);
        if (this.tokenStream.peekNext().token != Constants_1.Symbol.closeParenths) {
            this.incrementSpacer();
            nElements = await this.compileExpression();
            this.decrementSpacer();
        }
        const closeParenth = this.tokenStream.getNext().composeTag();
        await this.output([`</expressionList>` + os.EOL, closeParenth]);
        return nElements;
    }
    async compileArray() {
        if (this.tokenStream.peekNext().token === Constants_1.Symbol.openBracket) {
            const openBracket = this.tokenStream.getNext().composeTag();
            await this.output([openBracket]);
            await this.compileExpression();
            const closedBracket = this.tokenStream.getNext().composeTag();
            await this.output([closedBracket]);
        }
    }
    async compileMethodCall() {
        const period = this.tokenStream.getNext().composeTag();
        const methodName = this.tokenStream.getNext().composeTag();
        await this.output([period, methodName]);
        return methodName;
    }
    async output(output) {
        const outputLine = output.reduce((previousValue, _, currentIndex, array) => {
            return previousValue += this.spacer + array[currentIndex];
        }, "");
        if (outputLine.length > 0) {
            await this.writeLine(outputLine);
        }
    }
    resetSpacer() {
        this.spacer = "";
    }
    incrementSpacer() {
        this.spacer += Constants_1.spacer;
    }
    decrementSpacer() {
        if (this.spacer.length > 0) {
            this.spacer = this.spacer.slice(0, -Constants_1.spacer.length);
        }
    }
    /**
     * Starts subroutine in symbol table and defines the first argument "this"
     * @param className
     */
    startSymbolTableForSubroutine(className) {
        this.symbolTable.startSubroutine();
        this.symbolTable.define("this", className, Constants_1.SymbolKind.arg);
    }
    /**
     * Defines and outputs symbol table entry
     * @param name
     * @param type
     * @param kind
     */
    async defineSymbolTableEntry(name, type, kind) {
        this.symbolTable.define(name, type, kind);
        await this.symbolTable.composeTag(name, this.output.bind(this), this.incrementSpacer.bind(this), this.decrementSpacer.bind(this));
    }
    /**
     * Gets and outputs symbol table entry
     * @param name
     * @param type
     * @param kind
     */
    async getSymbolTableEntry(name) {
        if (name.type !== Constants_1.TokenType.identifier) {
            return;
        }
        const symbol = this.symbolTable.getSymbol(name.token);
        await this.symbolTable.composeTag(name.token, this.output.bind(this), this.incrementSpacer.bind(this), this.decrementSpacer.bind(this));
        return symbol;
    }
}
exports.Parser = Parser;
