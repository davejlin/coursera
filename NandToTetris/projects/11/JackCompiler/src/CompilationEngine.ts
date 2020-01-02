import { Processor } from "./Processor";
import { Keyword, Symbol, SymbolKind, TokenType, Operators, ExpressionTerminators, Segment, Command, SymbolKindSegmentMap } from "./Constants";
import { SymbolTable } from "./SymbolTable";
import { Symbol as SymbolClass } from "./Symbol";
import { Token } from "./Token";
import { TokenStream } from "./TokenStream";
import { VMWriter } from "./VMWriter";

export class CompilationEngine extends Processor {
    private symbolTable: SymbolTable;

    constructor (protected tokenStream: TokenStream, private vmWriter: VMWriter) {
        super(tokenStream, null);
    }
    /**
     * Compiles a complete class
     */
    public async process(): Promise<void> {
        this.symbolTable = new SymbolTable();

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
    }s

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
        this.startSymbolTableForSubroutine(className);

        const functionKeyword = this.tokenStream.getNext().composeTag();
        const returnType = this.tokenStream.getNext().composeTag();
        let methodName = "";

        if (this.tokenStream.peekNext().type === TokenType.identifier) {
            methodName = this.tokenStream.getNext().token;
        }

        const openParenths = this.tokenStream.getNext().composeTag();
        await this.compileParameterList();
        const closeParenths = this.tokenStream.getNext().composeTag();

        await this.compileSubroutineBody(className, methodName);
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
    private async compileSubroutineBody(className: string, methodName: string): Promise<void> {
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

        cycle = true;
        while (cycle) {
            switch (this.tokenStream.peekNext().token) {
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
    private async compileStatements(): Promise<void> {

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

        const closeBrace = this.tokenStream.getNext().composeTag();
    }

    /**
     * Compiles a let statement
     */
    private async compileLet(): Promise<void> {
        const letKeyword = this.tokenStream.getNext().composeTag();
        const name = this.tokenStream.getNext();

        const symbolTableEntry = await this.getSymbolTableEntry(name);

        if (this.tokenStream.peekNext().token === Symbol.openBracket) {
            await this.compileBracket();
        }     
        const equals = this.tokenStream.getNext().composeTag();

        await this.compileExpression();

        await this.vmWriter.writePop(SymbolKindSegmentMap.get(symbolTableEntry.kind), symbolTableEntry.index);

        const symbolSemicolon = this.tokenStream.getNext().composeTag();
    }

    /**
     * Compiles an if statement, possibly with a trailing else clause
     */
    private async compileIf(): Promise<void> {
        const ifKeyword = this.tokenStream.getNext().composeTag();
        const openPareths = this.tokenStream.getNext().composeTag();

        await this.compileExpression();

        const closeParenth = this.tokenStream.getNext().composeTag();
        const openBrace = this.tokenStream.getNext().composeTag();

        await this.compileStatements();

        if (this.tokenStream.peekNext().token === Keyword.else) {
            const elseKeyword = this.tokenStream.getNext().composeTag();
            const openBrace = this.tokenStream.getNext().composeTag();
            
            await this.compileStatements();
        }
    }

    /**
     * Compiles a while statement
     */
    private async compileWhile(): Promise<void> {        
        const whileKeyword = this.tokenStream.getNext().composeTag();
        const openPareths = this.tokenStream.getNext().composeTag();

        await this.compileExpression();

        const closeParenth = this.tokenStream.getNext().composeTag();
        const openBrace = this.tokenStream.getNext().composeTag();

        await this.compileStatements();
    }

    /**
     * Compiles a do statement
     */
    private async compileDo(): Promise<void> {        
        const doKeyword = this.tokenStream.getNext().composeTag();
        const identifier1 = this.tokenStream.getNext();
        let methodName = "";

        if (this.tokenStream.peekNext().token === Symbol.period) {
            methodName = await this.compileMethodCall();
        }

        const nElements = await this.compileExpressionList();

        const semicolon = this.tokenStream.getNext().composeTag();

        await this.vmWriter.writeCall(`${identifier1.token}.${methodName}`, nElements);
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
    private async compileExpression(): Promise<number> {
        let nElements = 1;
        let firstPass = true;
        let resetFirstPass = false;
        let negate = false;
        let peekNextToken = this.tokenStream.peekNext();

        while (!ExpressionTerminators.includes(peekNextToken.token)) {
            switch (peekNextToken.type) {
                case TokenType.symbol:
                    if (firstPass && (peekNextToken.token === Symbol.minus || peekNextToken.token === Symbol.tilda)) {
                        if (peekNextToken.token === Symbol.minus) {
                            negate = true;
                        }
                        await this.compileTerm();
                    } else if (peekNextToken.token === Symbol.openParenths) {
                        await this.compileTerm();
                    } else if (peekNextToken.token === Symbol.comma) {
                        nElements += 1;
                        const comma = this.tokenStream.getNext().composeTag();
                        if (negate) {
                            await this.vmWriter.writeArithmetic(Command.neg);
                            negate = false;
                        }
                        resetFirstPass = true;
                    } else {
                        const symbol = this.tokenStream.getNext();
                        await this.vmWriter.writeArithmetic(symbol.token);
                    }
                    break;
                default:
                    await this.compileTerm();
                    peekNextToken = this.tokenStream.peekNext();
                    if (Operators.includes(peekNextToken.token)) {
                        const symbol = this.tokenStream.getNext();
                        await this.compileTerm();
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

        if (negate) {
            await this.vmWriter.writeArithmetic(Command.neg);
            negate = false;
        }
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
    private async compileTerm(): Promise<void> {
        const peekNextToken = this.tokenStream.peekNext().token;

        switch (peekNextToken) {
            case Symbol.minus:
            case Symbol.tilda:
                const symbol = this.tokenStream.getNext().composeTag();

                await this.compileTerm();

                break;
            case Symbol.openParenths:
                const openPareths = this.tokenStream.getNext().composeTag();
    
                await this.compileExpression();
                
                const closeParenths = this.tokenStream.getNext().composeTag();
                break;
            default:
                const name = this.tokenStream.getNext();
                
                switch (this.tokenStream.peekNext().token) {
                    case Symbol.period:
                        const methodName = await this.compileMethodCall();
                        const nElements = await this.compileExpressionList();
                        await this.vmWriter.writeCall(`${name.token}.${methodName}`, nElements);
                        break;
                    case Symbol.openBracket:
                        await this.compileBracket();
                        // fall-through
                    default:
                        const numberConstant = Number(name.token);
                        if (isNaN(numberConstant))  {
                            const symbolTableEntry = await this.getSymbolTableEntry(name);
                            await this.vmWriter.writePush(SymbolKindSegmentMap.get(symbolTableEntry.kind), symbolTableEntry.index);
                        } else {
                            await this.vmWriter.writePush(Segment.const, numberConstant);
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

    private async compileBracket() {
        const openBracket = this.tokenStream.getNext().composeTag();
        
        await this.compileExpression();
        const closedBracket = this.tokenStream.getNext().composeTag();
    }

    private async compileMethodCall(): Promise<string> {
        const period = this.tokenStream.getNext().composeTag();
        const methodName = this.tokenStream.getNext();
        return methodName.token;
    }

    /**
     * Starts subroutine in symbol table and defines the first argument "this"
     * @param className 
     */
    private async startSymbolTableForSubroutine(className: string) {
        this.symbolTable.startSubroutine();
        this.symbolTable.define("this", className, SymbolKind.arg);
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
    private async getSymbolTableEntry(name: Token): Promise<SymbolClass> {
        if (name.type !== TokenType.identifier) {
            return;
        }

        const symbol = this.symbolTable.getSymbol(name.token);
        return symbol;
    }
}
