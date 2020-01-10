import { Processor } from "./Processor";
import { Keyword, Symbol, SymbolKind, TokenType, Operators, ExpressionTerminators, Segment, Command, SymbolKindSegmentMap, Labels, Methods, SymbolType, OsClasses } from "./Constants";
import { SymbolTable } from "./SymbolTable";
import { Symbol as SymbolClass } from "./Symbol";
import { Token } from "./Token";
import { TokenStream } from "./TokenStream";
import { VMWriter } from "./VMWriter";

export class CompilationEngine extends Processor {
    private symbolTable: SymbolTable;
    private classMap: Map<string, string>;
    private whileLabelNumber = 0;
    private ifLabelNumber = 0;

    constructor (protected tokenStream: TokenStream, private vmWriter: VMWriter) {
        super(tokenStream, null);
    }
    /**
     * Compiles a complete class
     */
    public async process(): Promise<void> {
        this.symbolTable = new SymbolTable();
        this.classMap = new Map<string, string>();

        const classKeyword = this.tokenStream.getNext();
        const name = this.tokenStream.getNext();
        const openSymbol = this.tokenStream.getNext();

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
                    await this.compileSubroutineDec(name.token);
                    if (this.tokenStream.peekNext().token === Symbol.closeBrace) {
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
    private async compileClassVarDec(): Promise<void> {
        await this.compileVars();
    }

    /**
     * Compiles a declaration for a method, function, or constructor
     */
    private async compileSubroutineDec(className: string): Promise<void> {

        const functionKeyword = this.tokenStream.getNext();
        const returnType = this.tokenStream.getNext().composeTag();
        let methodName = "";

        this.startSymbolTableForSubroutine(className, functionKeyword.token);
        this.resetWhileLabels();
        this.resetIfLabels();

        if (this.tokenStream.peekNext().type === TokenType.identifier) {
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
    private async compileParameterList(): Promise<void> {
        while (this.tokenStream.peekNext().token !== Symbol.closeParenths) {
            const type = this.tokenStream.getNext();
            const name = this.tokenStream.getNext();

            await this.defineSymbolTableEntry(name.token, type.token, SymbolKind.arg);

            const peekCommaSeparator = this.tokenStream.peekNext().token;
            if (peekCommaSeparator === Symbol.comma) {
                const comma = this.tokenStream.getNext().composeTag();
            }
        }
    }

    /**
     * Compiles the body of a method, function, or constructor
     */
    private async compileSubroutineBody(className: string, methodName: string, functionKeyword: string): Promise<void> {
        let cycle = true;

        const openBrace = this.tokenStream.getNext().composeTag();

        while (cycle) {
            switch (this.tokenStream.peekNext().token) {
                case Keyword.var:
                    await this.compileVarDec();
                    break;
                default:
                    cycle = false;
                    break;
            }
        }

        const nVars = this.symbolTable.varCount(SymbolKind.var);
        await this.vmWriter.writeFunction(`${className}.${methodName}`, nVars);

        if (methodName === Methods.new) {
            const nFields = this.symbolTable.varCount(SymbolKind.field);
            await this.vmWriter.writePush(Segment.const, nFields);
            await this.vmWriter.writeCall(`Memory.alloc`, 1);
            await this.vmWriter.writePop(Segment.pointer, 0);
        } else if (functionKeyword === Keyword.method) {
            await this.vmWriter.writePush(Segment.arg, 0);
            await this.vmWriter.writePop(Segment.pointer, 0);
        }                

        cycle = true;
        while (cycle) {
            switch (this.tokenStream.peekNext().token) {
                case Keyword.let:
                case Keyword.if:
                case Keyword.while:
                case Keyword.do:
                case Keyword.return:
                    await this.compileStatements(className);
                    cycle = false;
                default:
                    break;
            }
        }
    }

    /**
     * Compiles a var declaration
     */
    private async compileVarDec(): Promise<void> {
        await this.compileVars();
    }

    private async compileVars(): Promise<void> {
        const varKeyword = this.tokenStream.getNext();
        const type = this.tokenStream.getNext();
        const name = this.tokenStream.getNext();

        await this.defineSymbolTableEntry(name.token, type.token, SymbolKind[varKeyword.token]);

        while (this.tokenStream.peekNext().token === Symbol.comma) {
            const comma = this.tokenStream.getNext();
            const name = this.tokenStream.getNext();

            await this.defineSymbolTableEntry(name.token, type.token, SymbolKind[varKeyword.token])
        }

        const semicolon = this.tokenStream.getNext().composeTag();
    }

    /**
     * Compiles a sequence of statements, not including the enclosing “{}”
     */
    private async compileStatements(className: string): Promise<void> {

        while (this.tokenStream.peekNext().token != Symbol.closeBrace) {
            switch (this.tokenStream.peekNext().token) {
                case Keyword.let:
                    await this.compileLet(className);
                    break;
                case Keyword.if:
                    await this.compileIf(className);
                    break;
                case Keyword.while:
                    await this.compileWhile(className);
                    break;
                case Keyword.do:
                    await this.compileDo(className);
                    break;
                case Keyword.return:
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
    private async compileLet(className: string): Promise<void> {
        let isArray = false;
        const letKeyword = this.tokenStream.getNext().composeTag();
        const name = this.tokenStream.getNext();
        
        const symbolTableEntry = this.getSymbolTableEntry(name);

        if (this.tokenStream.peekNext().token === Symbol.openBracket) {
            isArray = true;
            await this.compileBracket(symbolTableEntry);
        }     
        const equals = this.tokenStream.getNext().composeTag();

        await this.compileExpression(name, className);

        if (symbolTableEntry != null) {
            if (isArray) {
                await this.compileArrayEnd();
            } else {
                await this.vmWriter.writePop(SymbolKindSegmentMap.get(symbolTableEntry.kind), symbolTableEntry.index);
            }
        }

        const symbolSemicolon = this.tokenStream.getNext().composeTag();
    }

    /**
     * Compiles an if statement, possibly with a trailing else clause
     */
    private async compileIf(className: string): Promise<void> {
        const ifIndex = this.getAndIncrementIfIndex();

        const ifKeyword = this.tokenStream.getNext().composeTag();
        const openPareths = this.tokenStream.getNext().composeTag();

        await this.compileExpression(null, className);

        await this.vmWriter.writeIf(`${Labels.ifTrue}${ifIndex}`);
        await this.vmWriter.writeGoto(`${Labels.ifFalse}${ifIndex}`);
        await this.vmWriter.writeLabel(`${Labels.ifTrue}${ifIndex}`);

        const closeParenth = this.tokenStream.getNext().composeTag();
        const openBrace = this.tokenStream.getNext().composeTag();

        await this.compileStatements(className);



        if (this.tokenStream.peekNext().token === Keyword.else) {
            const elseKeyword = this.tokenStream.getNext().composeTag();
            const openBrace = this.tokenStream.getNext().composeTag();
            
            await this.vmWriter.writeGoto(`${Labels.ifEnd}${ifIndex}`);
            await this.vmWriter.writeLabel(`${Labels.ifFalse}${ifIndex}`);

            await this.compileStatements(className);

            await this.vmWriter.writeLabel(`${Labels.ifEnd}${ifIndex}`);
        } else {
            await this.vmWriter.writeLabel(`${Labels.ifFalse}${ifIndex}`);
        }


    }

    /**
     * Compiles a while statement
     */
    private async compileWhile(className: string): Promise<void> {
        const whileIndex = this.getAndIncrementWhileIndex();
        await this.vmWriter.writeLabel(`${Labels.whileStart}${whileIndex}`);

        const whileKeyword = this.tokenStream.getNext().composeTag();
        const openPareths = this.tokenStream.getNext().composeTag();

        await this.compileExpression(null, className);

        await this.vmWriter.writeArithmetic(Command.not);
        await this.vmWriter.writeIf(`${Labels.whileEnd}${whileIndex}`);

        const closeParenth = this.tokenStream.getNext().composeTag();
        const openBrace = this.tokenStream.getNext().composeTag();

        await this.compileStatements(className);

        await this.vmWriter.writeGoto(`${Labels.whileStart}${whileIndex}`);
        await this.vmWriter.writeLabel(`${Labels.whileEnd}${whileIndex}`);
    }

    /**
     * Compiles a do statement
     */
    private async compileDo(className: string): Promise<void> {        
        const doKeyword = this.tokenStream.getNext().composeTag();
        const identifier1 = this.tokenStream.getNext();
        let methodName = "";

        if (this.tokenStream.peekNext().token === Symbol.period) {
            methodName = await this.getMethodName();
        }

        let nArgs = await this.compileExpressionList();

        const semicolon = this.tokenStream.getNext().composeTag();

        await this.compileMethodCall(identifier1, identifier1.token, methodName, className, nArgs);
        await this.vmWriter.writePop(Segment.temp, 0);
    }

    /**
     * Compiles a return statement
     */
    private async compileReturn(): Promise<void> {        
        const returnKeyword = this.tokenStream.getNext().composeTag();

        if (this.tokenStream.peekNext().token !== Symbol.semicolon) {
            await this.compileExpression();
        } else {
            await this.vmWriter.writePush(Segment.const, 0);
        }

        const semicolon = this.tokenStream.getNext().composeTag();
        await this.vmWriter.writeReturn();
    }

    /**
     * Compiles an expression
     */
    private async compileExpression(varToken: Token = null, className: string = null): Promise<number> {
        let nElements = 1;
        let firstPass = true;
        let resetFirstPass = false;
        let negate = false;
        let not = false;
        let peekNextToken = this.tokenStream.peekNext();
        let symbolToken: Token;

        while (!ExpressionTerminators.includes(peekNextToken.token)) {
            switch (peekNextToken.type) {
                case TokenType.symbol:
                    if (firstPass && (peekNextToken.token === Symbol.minus || peekNextToken.token === Symbol.tilda)) {
                        switch (peekNextToken.token) {
                            case Symbol.minus:
                                negate = true;
                                break;
                            case Symbol.tilda:
                                not = true;
                                break;
                            default:
                                break;
                        }
                        await this.compileTerm(varToken, className);
                    } else if (peekNextToken.token === Symbol.openParenths) {
                        await this.compileTerm(varToken, className);
                    } else if (peekNextToken.token === Symbol.comma) {
                        nElements += 1;
                        const comma = this.tokenStream.getNext().composeTag();
                        symbolToken = await this.compileSymbol(symbolToken);
                        ({ negate, not } = await this.writeNegateOrNot(negate, not));
                        resetFirstPass = true;
                    } else {
                        symbolToken = this.tokenStream.getNext();
                    }
                    break;
                default:
                    await this.compileTerm(varToken, className);
                    peekNextToken = this.tokenStream.peekNext();
                    if (Operators.includes(peekNextToken.token)) {
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
            } else {
                firstPass = false;
            }

        }

        ({ negate, not } = await this.writeNegateOrNot(negate, not));
        symbolToken = await this.compileSymbol(symbolToken);

        return nElements;
    }

    private async writeNegateOrNot(negate: boolean, not: boolean) {
        if (negate) {
            await this.vmWriter.writeArithmetic(Command.neg);
            negate = false;
        }
        if (not) {
            await this.vmWriter.writeArithmetic(Command.not);
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
    private async compileTerm(varToken: Token = null, className: string = null): Promise<void> {
        const peekNextToken = this.tokenStream.peekNext().token;

        switch (peekNextToken) {
            case Symbol.minus:
            case Symbol.tilda:
                const symbol = this.tokenStream.getNext().composeTag();

                await this.compileTerm(varToken, className);

                break;
            case Symbol.openParenths:
                const openPareths = this.tokenStream.getNext().composeTag();
    
                await this.compileExpression(varToken, className);
                
                const closeParenths = this.tokenStream.getNext().composeTag();
                break;
            default:
                const name = this.tokenStream.getNext();

                switch (this.tokenStream.peekNext().token) {
                    case Symbol.period:
                        const methodName = await this.getMethodName(varToken.token, name.token);
                        const nArgs = await this.compileExpressionList();
                        await this.compileMethodCall(varToken, name.token, methodName, className, nArgs);
                        break;
                    case Symbol.openBracket:
                        await this.compileBracket(this.getSymbolTableEntry(name), true);
                        // fall-through
                    default:
                        let segment: Segment;
                        let index: number;
                        const numberConstant = Number(name.token);

                        if (isNaN(numberConstant))  {
                            const type = name.type;
                            switch (type) {
                                case TokenType.identifier:
                                    const symbolTableEntry = this.getSymbolTableEntry(name);
                                    if (symbolTableEntry != null && symbolTableEntry.type !== SymbolType.array) {
                                        segment = SymbolKindSegmentMap.get(symbolTableEntry.kind);
                                        index = symbolTableEntry.index;
                                    }
                                    break;
                                case TokenType.stringConstant:
                                    await this.compileStringConstant(name.token);
                                    break;
                                case TokenType.keyword:
                                    switch (name.token) {
                                        case Keyword.this:
                                            segment = Segment.pointer;
                                            index = 0;
                                            break;
                                        case Keyword.true:
                                            await this.vmWriter.writePush(Segment.const, 0);
                                            await this.vmWriter.writeArithmetic(Command.not);
                                            break;
                                        case Keyword.false:
                                        case Keyword.null:
                                            await this.vmWriter.writePush(Segment.const, 0);
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            segment = Segment.const;
                            index = numberConstant;
                        }

                        if (segment != null && index != null) {
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
    private async compileExpressionList(): Promise<number> {
        let nElements = 0;
        const openParenths = this.tokenStream.getNext().composeTag();

        if (this.tokenStream.peekNext().token != Symbol.closeParenths) {
            nElements = await this.compileExpression();
        }

        const closeParenth = this.tokenStream.getNext().composeTag();
        return nElements;
    }

    /**
     * for methods, get mapped name of class, adjust number of arguments of method, push class' memory segment to stack
     * @param varToken 
     * @param tokenName 
     * @param nArgs 
     */
    private async compileMethodCall(varToken: Token, tokenName: string, methodName: string, className: string, nArgs: number): Promise<void> {
        let adjustedNArgs = nArgs;
        let mappedName = OsClasses.includes(tokenName) ? null : this.classMap.get(varToken.token);

        if (methodName) {
            if (mappedName) {
                const symbolTableEntry = this.getSymbolTableEntry(varToken);
                const segment = SymbolKindSegmentMap.get(symbolTableEntry.kind);
    
                if (methodName !== Methods.new) {
                    adjustedNArgs += 1; // add one argument (this) for methods
                    await this.vmWriter.writePush(segment, symbolTableEntry.index);
                }
            } else {
                mappedName = tokenName;
            }

            await this.vmWriter.writeCall(`${mappedName}.${methodName}`, adjustedNArgs);
        } else {
            adjustedNArgs += 1; // add one argument (this) for methods
            await this.vmWriter.writePush(Segment.pointer, 0);
            await this.vmWriter.writeCall(`${className}.${varToken.token}`, adjustedNArgs);
        }
    }

    private async compileBracket(symbolTableEntry: SymbolClass, fromExpression: boolean = false) {
        const openBracket = this.tokenStream.getNext().composeTag();
        
        await this.compileExpression();
        const closedBracket = this.tokenStream.getNext().composeTag();
        await this.vmWriter.writePush(SymbolKindSegmentMap.get(symbolTableEntry.kind), symbolTableEntry.index);
        await this.vmWriter.writeArithmetic(Symbol.plus);
        
        if (fromExpression) {
            await this.vmWriter.writePop(Segment.pointer, 1);
            await this.vmWriter.writePush(Segment.that, 0);
        }
    }

    private async compileSymbol(symbolToken: Token): Promise<null> {
        if (symbolToken) {
            await this.vmWriter.writeArithmetic(symbolToken.token);
        }
        return null;
    }

    private async compileArrayEnd(): Promise<void> {
        await this.vmWriter.writePop(Segment.temp, 0);
        await this.vmWriter.writePop(Segment.pointer, 1);
        await this.vmWriter.writePush(Segment.temp, 0);
        await this.vmWriter.writePop(Segment.that, 0);
    }

    private ascii (a: string): number { return a.charCodeAt(0); }

    private async compileStringConstant(stringConstant: string): Promise<void> {
        const stringStripped = stringConstant.slice(1,-1);
        const nChars = stringStripped.length;
        await this.vmWriter.writePush(Segment.const, nChars);
        await this.vmWriter.writeCall(`String.new`, 1);

        const asciiValues = stringStripped.split('').map(this.ascii);
        for (const value of asciiValues) {
            await this.vmWriter.writePush(Segment.const, value);
            await this.vmWriter.writeCall(`String.appendChar`, 2);
        }

    }

    private async getMethodName(varName: string = null, className: string = null): Promise<string> {
        const period = this.tokenStream.getNext().composeTag();
        const methodName = this.tokenStream.getNext();

        if (methodName.token === Methods.new && varName != null) {
            this.classMap.set(varName, className)
        }

        return methodName.token;
    }

    /**
     * Starts subroutine in symbol table and defines the first argument "this"
     * @param className 
     */
    private async startSymbolTableForSubroutine(className: string, functionKeyword: string) {
        this.symbolTable.startSubroutine();

        if (functionKeyword === Keyword.method) {
            this.symbolTable.define("this", className, SymbolKind.arg);
        }
    }

    /**
     * Defines and outputs symbol table entry
     * @param name 
     * @param type 
     * @param kind 
     */
    private async defineSymbolTableEntry(name: string, type: string, kind: SymbolKind): Promise<void> {
        this.symbolTable.define(name, type, kind);
    }

    /**
     * Gets and outputs symbol table entry
     * @param name 
     */
    private getSymbolTableEntry(name: Token): SymbolClass {
        if (name.type !== TokenType.identifier) {
            return;
        }

        const symbol = this.symbolTable.getSymbol(name.token);
        return symbol;
    }

    private getAndIncrementWhileIndex(): number {
        return this.whileLabelNumber++;
    }
    
    private resetWhileLabels(): void {
        this.whileLabelNumber = 0;
    }

    private getAndIncrementIfIndex(): number {
        return this.ifLabelNumber++;
    }

    private resetIfLabels(): void {
        this.ifLabelNumber = 0;
    }
}
