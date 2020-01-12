"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Processor_1 = require("./Processor");
const Constants_1 = require("./Constants");
const SymbolTable_1 = require("./SymbolTable");
class CompilationEngine extends Processor_1.Processor {
    constructor(tokenStream, vmWriter) {
        super(tokenStream, null);
        this.tokenStream = tokenStream;
        this.vmWriter = vmWriter;
        this.whileLabelNumber = 0;
        this.ifLabelNumber = 0;
    }
    /**
     * Compiles a complete class
     */
    async process() {
        this.symbolTable = new SymbolTable_1.SymbolTable();
        this.classMap = new Map();
        const classKeyword = this.tokenStream.getNext();
        const name = this.tokenStream.getNext();
        const openSymbol = this.tokenStream.getNext();
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
    }
    /**
     * Compiles a static declaration or a field declaration
     */
    async compileClassVarDec() {
        await this.compileVars();
    }
    /**
     * Compiles a declaration for a method, function, or constructor
     */
    async compileSubroutineDec(className) {
        const functionKeyword = this.tokenStream.getNext();
        const returnType = this.tokenStream.getNext().composeTag();
        let methodName = "";
        this.startSymbolTableForSubroutine(className, functionKeyword.token);
        this.resetWhileLabels();
        this.resetIfLabels();
        if (this.tokenStream.peekNext().type === Constants_1.TokenType.identifier) {
            methodName = this.tokenStream.getNext().token;
        }
        const openParenths = this.tokenStream.getNext().composeTag();
        await this.compileParameterList();
        const closeParenths = this.tokenStream.getNext().composeTag();
        await this.compileSubroutineBody(className, methodName, functionKeyword.token);
    }
    /**
     * Compiles a (possibly empty) parameter list, not including the enclosing “()”
     */
    async compileParameterList() {
        while (this.tokenStream.peekNext().token !== Constants_1.Symbol.closeParenths) {
            const type = this.tokenStream.getNext();
            const name = this.tokenStream.getNext();
            await this.defineSymbolTableEntry(name.token, type.token, Constants_1.SymbolKind.arg);
            const peekCommaSeparator = this.tokenStream.peekNext().token;
            if (peekCommaSeparator === Constants_1.Symbol.comma) {
                const comma = this.tokenStream.getNext().composeTag();
            }
        }
    }
    /**
     * Compiles the body of a method, function, or constructor
     */
    async compileSubroutineBody(className, methodName, functionKeyword) {
        let cycle = true;
        const openBrace = this.tokenStream.getNext().composeTag();
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
        const nVars = this.symbolTable.varCount(Constants_1.SymbolKind.var);
        await this.vmWriter.writeFunction(`${className}.${methodName}`, nVars);
        if (methodName === Constants_1.Methods.new) {
            const nFields = this.symbolTable.varCount(Constants_1.SymbolKind.field);
            await this.vmWriter.writePush(Constants_1.Segment.const, nFields);
            await this.vmWriter.writeCall(`Memory.alloc`, 1);
            await this.vmWriter.writePop(Constants_1.Segment.pointer, 0);
        }
        else if (functionKeyword === Constants_1.Keyword.method) {
            await this.vmWriter.writePush(Constants_1.Segment.arg, 0);
            await this.vmWriter.writePop(Constants_1.Segment.pointer, 0);
        }
        await this.compileStatements(className);
    }
    /**
     * Compiles a var declaration
     */
    async compileVarDec() {
        await this.compileVars();
    }
    async compileVars() {
        const varKeyword = this.tokenStream.getNext();
        const type = this.tokenStream.getNext();
        while (true) {
            const name = this.tokenStream.getNext();
            await this.defineSymbolTableEntry(name.token, type.token, Constants_1.SymbolKind[varKeyword.token]);
            if (this.tokenStream.peekNext().token === Constants_1.Symbol.comma) {
                const comma = this.tokenStream.getNext();
            }
            else {
                break;
            }
        }
        const semicolon = this.tokenStream.getNext().composeTag();
    }
    /**
     * Compiles a sequence of statements, not including the enclosing “{}”
     */
    async compileStatements(className) {
        while (this.tokenStream.peekNext().token != Constants_1.Symbol.closeBrace) {
            switch (this.tokenStream.peekNext().token) {
                case Constants_1.Keyword.let:
                    await this.compileLet(className);
                    break;
                case Constants_1.Keyword.if:
                    await this.compileIf(className);
                    break;
                case Constants_1.Keyword.while:
                    await this.compileWhile(className);
                    break;
                case Constants_1.Keyword.do:
                    await this.compileDo(className);
                    break;
                case Constants_1.Keyword.return:
                    await this.compileReturn();
                    break;
                default:
                    break;
            }
        }
        const closeBrace = this.tokenStream.getNext().composeTag();
    }
    /**
     * Compiles a let statement
     */
    async compileLet(className) {
        let isBracketedArray = false;
        const letKeyword = this.tokenStream.getNext().composeTag();
        const name = this.tokenStream.getNext();
        const symbolTableEntry = this.getSymbolTableEntry(name);
        if (symbolTableEntry.type === Constants_1.SymbolType.array) {
            isBracketedArray = await this.compileArray(symbolTableEntry);
        }
        const equals = this.tokenStream.getNext().composeTag();
        await this.compileExpression(name, className);
        if (symbolTableEntry) {
            if (isBracketedArray) {
                await this.compileArrayEnd();
            }
            else {
                await this.vmWriter.writePop(Constants_1.SymbolKindSegmentMap.get(symbolTableEntry.kind), symbolTableEntry.index);
            }
        }
        const symbolSemicolon = this.tokenStream.getNext().composeTag();
    }
    /**
     * Compiles an if statement, possibly with a trailing else clause
     */
    async compileIf(className) {
        const ifIndex = this.getAndIncrementIfIndex();
        const ifKeyword = this.tokenStream.getNext().composeTag();
        const openPareths = this.tokenStream.getNext().composeTag();
        await this.compileExpression(null, className);
        await this.vmWriter.writeIf(`${Constants_1.Labels.ifTrue}${ifIndex}`);
        await this.vmWriter.writeGoto(`${Constants_1.Labels.ifFalse}${ifIndex}`);
        await this.vmWriter.writeLabel(`${Constants_1.Labels.ifTrue}${ifIndex}`);
        const closeParenth = this.tokenStream.getNext().composeTag();
        const openBrace = this.tokenStream.getNext().composeTag();
        await this.compileStatements(className);
        if (this.tokenStream.peekNext().token === Constants_1.Keyword.else) {
            const elseKeyword = this.tokenStream.getNext().composeTag();
            const openBrace = this.tokenStream.getNext().composeTag();
            await this.vmWriter.writeGoto(`${Constants_1.Labels.ifEnd}${ifIndex}`);
            await this.vmWriter.writeLabel(`${Constants_1.Labels.ifFalse}${ifIndex}`);
            await this.compileStatements(className);
            await this.vmWriter.writeLabel(`${Constants_1.Labels.ifEnd}${ifIndex}`);
        }
        else {
            await this.vmWriter.writeLabel(`${Constants_1.Labels.ifFalse}${ifIndex}`);
        }
    }
    /**
     * Compiles a while statement
     */
    async compileWhile(className) {
        const whileIndex = this.getAndIncrementWhileIndex();
        await this.vmWriter.writeLabel(`${Constants_1.Labels.whileStart}${whileIndex}`);
        const whileKeyword = this.tokenStream.getNext().composeTag();
        const openPareths = this.tokenStream.getNext().composeTag();
        await this.compileExpression(null, className);
        await this.vmWriter.writeArithmetic(Constants_1.Command.not);
        await this.vmWriter.writeIf(`${Constants_1.Labels.whileEnd}${whileIndex}`);
        const closeParenth = this.tokenStream.getNext().composeTag();
        const openBrace = this.tokenStream.getNext().composeTag();
        await this.compileStatements(className);
        await this.vmWriter.writeGoto(`${Constants_1.Labels.whileStart}${whileIndex}`);
        await this.vmWriter.writeLabel(`${Constants_1.Labels.whileEnd}${whileIndex}`);
    }
    /**
     * Compiles a do statement
     */
    async compileDo(className) {
        const doKeyword = this.tokenStream.getNext().composeTag();
        const identifier = this.tokenStream.getNext();
        await this.compileMethodCall(identifier, className);
        await this.vmWriter.writePop(Constants_1.Segment.temp, 0);
        const semicolon = this.tokenStream.getNext().composeTag();
    }
    /**
     * Compiles a return statement
     */
    async compileReturn() {
        const returnKeyword = this.tokenStream.getNext().composeTag();
        if (this.tokenStream.peekNext().token !== Constants_1.Symbol.semicolon) {
            await this.compileExpression();
        }
        else {
            await this.vmWriter.writePush(Constants_1.Segment.const, 0);
        }
        const semicolon = this.tokenStream.getNext().composeTag();
        await this.vmWriter.writeReturn();
    }
    /**
     * Compiles an expression
     */
    async compileExpression(varToken = null, className = null) {
        let nElements = 1;
        let firstPass = true;
        let resetFirstPass = false;
        let negate = false;
        let not = false;
        let peekNextToken = this.tokenStream.peekNext();
        let symbolToken;
        while (!Constants_1.ExpressionTerminators.includes(peekNextToken.token)) {
            switch (peekNextToken.type) {
                case Constants_1.TokenType.symbol:
                    if (firstPass && (peekNextToken.token === Constants_1.Symbol.minus || peekNextToken.token === Constants_1.Symbol.tilda)) {
                        switch (peekNextToken.token) {
                            case Constants_1.Symbol.minus:
                                negate = true;
                                break;
                            case Constants_1.Symbol.tilda:
                                not = true;
                                break;
                            default:
                                break;
                        }
                        await this.compileTerm(varToken, className);
                    }
                    else if (peekNextToken.token === Constants_1.Symbol.openParenths) {
                        await this.compileTerm(varToken, className);
                    }
                    else if (peekNextToken.token === Constants_1.Symbol.comma) {
                        nElements += 1;
                        const comma = this.tokenStream.getNext().composeTag();
                        symbolToken = await this.compileSymbol(symbolToken);
                        ({ negate, not } = await this.writeNegateOrNot(negate, not));
                        resetFirstPass = true;
                    }
                    else {
                        symbolToken = this.tokenStream.getNext();
                    }
                    break;
                default:
                    await this.compileTerm(varToken, className);
                    peekNextToken = this.tokenStream.peekNext();
                    if (Constants_1.Operators.includes(peekNextToken.token)) {
                        const symbol = this.tokenStream.getNext();
                        await this.compileTerm(varToken, className);
                        await this.vmWriter.writeArithmetic(symbol.token);
                    }
                    break;
            }
            peekNextToken = this.tokenStream.peekNext();
            if (resetFirstPass) {
                firstPass = true;
                resetFirstPass = false;
            }
            else {
                firstPass = false;
            }
        }
        ({ negate, not } = await this.writeNegateOrNot(negate, not));
        symbolToken = await this.compileSymbol(symbolToken);
        return nElements;
    }
    async writeNegateOrNot(negate, not) {
        if (negate) {
            await this.vmWriter.writeArithmetic(Constants_1.Command.neg);
            negate = false;
        }
        if (not) {
            await this.vmWriter.writeArithmetic(Constants_1.Command.not);
            not = false;
        }
        return { negate, not };
    }
    /**
     * Compiles a term.  If the current token is an identifier,
     * the routine distinguishes between a variable, an array entry,
     * or a subroutine call.  A single look-ahead token, which may be
     * one of "["", "("", or "." suffices to distinguish between the
     * possibilities.  Any other token is not part of this term and
     * should not be advanced over
     */
    async compileTerm(varToken = null, className = null) {
        const peekNextToken = this.tokenStream.peekNext().token;
        switch (peekNextToken) {
            case Constants_1.Symbol.minus:
            case Constants_1.Symbol.tilda:
                const symbol = this.tokenStream.getNext().composeTag();
                await this.compileTerm(varToken, className);
                break;
            case Constants_1.Symbol.openParenths:
                const openPareths = this.tokenStream.getNext().composeTag();
                await this.compileExpression(varToken, className);
                const closeParenths = this.tokenStream.getNext().composeTag();
                break;
            default:
                const name = this.tokenStream.getNext();
                const symbolTableEntry = this.getSymbolTableEntry(name);
                if (symbolTableEntry && symbolTableEntry.type === Constants_1.SymbolType.array) {
                    await this.compileArray(symbolTableEntry, true);
                    return;
                }
                switch (this.tokenStream.peekNext().token) {
                    case Constants_1.Symbol.period:
                        await this.compileMethodCall(name, className);
                        break;
                    default:
                        let segment;
                        let index;
                        const numberConstant = Number(name.token);
                        if (isNaN(numberConstant)) {
                            const type = name.type;
                            switch (type) {
                                case Constants_1.TokenType.identifier:
                                    if (symbolTableEntry) {
                                        segment = Constants_1.SymbolKindSegmentMap.get(symbolTableEntry.kind);
                                        index = symbolTableEntry.index;
                                    }
                                    break;
                                case Constants_1.TokenType.stringConstant:
                                    await this.compileStringConstant(name.token);
                                    break;
                                case Constants_1.TokenType.keyword:
                                    switch (name.token) {
                                        case Constants_1.Keyword.this:
                                            segment = Constants_1.Segment.pointer;
                                            index = 0;
                                            break;
                                        case Constants_1.Keyword.true:
                                            await this.vmWriter.writePush(Constants_1.Segment.const, 0);
                                            await this.vmWriter.writeArithmetic(Constants_1.Command.not);
                                            break;
                                        case Constants_1.Keyword.false:
                                        case Constants_1.Keyword.null:
                                            await this.vmWriter.writePush(Constants_1.Segment.const, 0);
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        else {
                            segment = Constants_1.Segment.const;
                            index = numberConstant;
                        }
                        if (segment) {
                            await this.vmWriter.writePush(segment, index);
                        }
                        break;
                }
                break;
        }
    }
    /**
     * Compiles a possibly empty comma-separated list of expressions
     */
    async compileExpressionList() {
        let nElements = 0;
        const openParenths = this.tokenStream.getNext().composeTag();
        if (this.tokenStream.peekNext().token != Constants_1.Symbol.closeParenths) {
            nElements = await this.compileExpression();
        }
        const closeParenth = this.tokenStream.getNext().composeTag();
        return nElements;
    }
    /**
     * for methods, get mapped name of class, adjust number of arguments of method, push class' memory segment to stack
     * (e.g. identififier.method)
     * @param identifier identifier's token
     * @param className name of the current class
     * @param nArgs number of arguments in the method call
     */
    async compileMethodCall(identifier, className) {
        let methodName = "";
        if (this.tokenStream.peekNext().token === Constants_1.Symbol.period) {
            methodName = await this.getMethodName();
        }
        if (methodName) {
            let nArgsToAdd = 0;
            const identifierName = identifier.token;
            let mappedName = Constants_1.OsClasses.includes(identifierName) ? null : this.classMap.get(identifierName);
            if (mappedName) {
                const symbolTableEntry = this.getSymbolTableEntry(identifier);
                const segment = Constants_1.SymbolKindSegmentMap.get(symbolTableEntry.kind);
                if (mappedName !== identifierName) { // condition for a method, since a function uses the class' name, while a method uses the variable's name
                    nArgsToAdd = 1; // add one argument (this) for methods
                    await this.vmWriter.writePush(segment, symbolTableEntry.index);
                }
            }
            else {
                mappedName = identifierName;
            }
            const nArgs = await this.compileExpressionList() + nArgsToAdd;
            await this.vmWriter.writeCall(`${mappedName}.${methodName}`, nArgs);
        }
        else {
            await this.vmWriter.writePush(Constants_1.Segment.pointer, 0);
            const nArgs = await this.compileExpressionList() + 1; // add one argument (this) for methods
            await this.vmWriter.writeCall(`${className}.${identifier.token}`, nArgs);
        }
    }
    async compileArray(symbolTableEntry, fromExpression = false) {
        if (this.tokenStream.peekNext().token === Constants_1.Symbol.openBracket) {
            const openBracket = this.tokenStream.getNext().composeTag();
            await this.compileExpression();
            const closedBracket = this.tokenStream.getNext().composeTag();
            await this.vmWriter.writePush(Constants_1.SymbolKindSegmentMap.get(symbolTableEntry.kind), symbolTableEntry.index);
            await this.vmWriter.writeArithmetic(Constants_1.Symbol.plus);
            if (fromExpression) {
                await this.vmWriter.writePop(Constants_1.Segment.pointer, 1);
                await this.vmWriter.writePush(Constants_1.Segment.that, 0);
            }
            return true;
        }
        else if (fromExpression) {
            await this.vmWriter.writePush(Constants_1.SymbolKindSegmentMap.get(symbolTableEntry.kind), symbolTableEntry.index);
            return false;
        }
    }
    async compileSymbol(symbolToken) {
        if (symbolToken) {
            await this.vmWriter.writeArithmetic(symbolToken.token);
        }
        return null;
    }
    async compileArrayEnd() {
        await this.vmWriter.writePop(Constants_1.Segment.temp, 0);
        await this.vmWriter.writePop(Constants_1.Segment.pointer, 1);
        await this.vmWriter.writePush(Constants_1.Segment.temp, 0);
        await this.vmWriter.writePop(Constants_1.Segment.that, 0);
    }
    ascii(a) { return a.charCodeAt(0); }
    async compileStringConstant(stringConstant) {
        const stringStripped = stringConstant.slice(1, -1);
        const nChars = stringStripped.length;
        await this.vmWriter.writePush(Constants_1.Segment.const, nChars);
        await this.vmWriter.writeCall(`String.new`, 1);
        const asciiValues = stringStripped.split('').map(this.ascii);
        for (const value of asciiValues) {
            await this.vmWriter.writePush(Constants_1.Segment.const, value);
            await this.vmWriter.writeCall(`String.appendChar`, 2);
        }
    }
    async getMethodName() {
        const period = this.tokenStream.getNext().composeTag();
        const methodName = this.tokenStream.getNext();
        return methodName.token;
    }
    /**
     * Starts subroutine in symbol table
     * @param className
     */
    startSymbolTableForSubroutine(className, functionKeyword) {
        this.symbolTable.startSubroutine();
        if (functionKeyword === Constants_1.Keyword.method) {
            this.symbolTable.define("this", className, Constants_1.SymbolKind.arg);
        }
    }
    /**
     * Defines and outputs symbol table entry
     * @param name
     * @param type
     * @param kind
     */
    async defineSymbolTableEntry(name, type, kind) {
        this.symbolTable.define(name, type, kind);
        if (!Constants_1.PrimitiveTypes.includes(type)) {
            this.classMap.set(name, type);
        }
    }
    /**
     * Gets and outputs symbol table entry
     * @param name
     */
    getSymbolTableEntry(name) {
        if (name.type !== Constants_1.TokenType.identifier) {
            return;
        }
        const symbol = this.symbolTable.getSymbol(name.token);
        return symbol;
    }
    getAndIncrementWhileIndex() {
        return this.whileLabelNumber++;
    }
    resetWhileLabels() {
        this.whileLabelNumber = 0;
    }
    getAndIncrementIfIndex() {
        return this.ifLabelNumber++;
    }
    resetIfLabels() {
        this.ifLabelNumber = 0;
    }
}
exports.CompilationEngine = CompilationEngine;
