export const commentSymbolType1 = "//";
export const commentSymbolType2 = "/*";
export const spaceSymbol = " ";
export const emptySymbol = "";
export const quoteSymbol = "\"";

export enum FileType {
    jack = "jack",
    xml = "xml"
}

export enum TokenType {
    keyword = "keyword",
    symbol = "symbol",
    identifier = "identifier",
    integerConstant = "integerConstant",
    stringConstant = "stringConstant",
    unknown = "unknown"
}

export enum Keyword {
    class = "class",
    constructor = "constructor",
    function = "function",
    method = "method",
    field = "field",
    static = "static",
    var = "var",
    int = "int",
    char = "char",
    boolean = "boolean",
    void = "void",
    true = "true",
    false = "false",
    null = "null",
    this = "this",
    let = "let",
    do = "do",
    if = "if",
    else = "else",
    while = "while",
    return = "return"
}

export const Keywords: string[] = [
    Keyword.class,
    Keyword.constructor,
    Keyword.function,
    Keyword.method,
    Keyword.field,
    Keyword.static,
    Keyword.var,
    Keyword.int,
    Keyword.char,
    Keyword.boolean,
    Keyword.void,
    Keyword.true,
    Keyword.false,
    Keyword.null,
    Keyword.this,
    Keyword.let,
    Keyword.do,
    Keyword.if,
    Keyword.else,
    Keyword.while,
    Keyword.return
];

export enum Symbol {
    openBrace = "{",
    closeBrace = "}",
    openParenths = "(",
    closeParenths = ")",
    openBracket = "[",
    closeBracket = "]",
    period = ".",
    comma = ",",
    semicolon = ";",
    plus = "+",
    minus = "-",
    asterick = "*",
    slash = "/",
    amperstand = "&",
    pipe = "|",
    lt = "<",
    gt = ">",
    eq = "=",
    tilda = "~"
}

export const Symbols: string[] = [
    Symbol.openBrace,
    Symbol.closeBrace,
    Symbol.openParenths,
    Symbol.closeParenths,
    Symbol.openBracket,
    Symbol.closeBracket,
    Symbol.period,
    Symbol.comma,
    Symbol.semicolon,
    Symbol.plus,
    Symbol.minus,
    Symbol.asterick,
    Symbol.slash,
    Symbol.amperstand,
    Symbol.pipe,
    Symbol.lt,
    Symbol.gt,
    Symbol.eq,
    Symbol.tilda
]