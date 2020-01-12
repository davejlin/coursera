"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSymbolType1 = "//";
exports.commentSymbolType2 = "/*";
exports.spaceSymbol = " ";
exports.emptySymbol = "";
exports.quoteSymbol = "\"";
exports.spacer = "  ";
var FileType;
(function (FileType) {
    FileType["jack"] = "jack";
    FileType["vm"] = "vm";
    FileType["xml"] = "xml";
})(FileType = exports.FileType || (exports.FileType = {}));
var TokenType;
(function (TokenType) {
    TokenType["keyword"] = "keyword";
    TokenType["symbol"] = "symbol";
    TokenType["identifier"] = "identifier";
    TokenType["integerConstant"] = "integerConstant";
    TokenType["stringConstant"] = "stringConstant";
    TokenType["unknown"] = "unknown";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
var Keyword;
(function (Keyword) {
    Keyword["class"] = "class";
    Keyword["constructor"] = "constructor";
    Keyword["function"] = "function";
    Keyword["method"] = "method";
    Keyword["field"] = "field";
    Keyword["static"] = "static";
    Keyword["var"] = "var";
    Keyword["int"] = "int";
    Keyword["char"] = "char";
    Keyword["boolean"] = "boolean";
    Keyword["void"] = "void";
    Keyword["true"] = "true";
    Keyword["false"] = "false";
    Keyword["null"] = "null";
    Keyword["this"] = "this";
    Keyword["let"] = "let";
    Keyword["do"] = "do";
    Keyword["if"] = "if";
    Keyword["else"] = "else";
    Keyword["while"] = "while";
    Keyword["return"] = "return";
})(Keyword = exports.Keyword || (exports.Keyword = {}));
exports.Keywords = [
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
var Symbol;
(function (Symbol) {
    Symbol["openBrace"] = "{";
    Symbol["closeBrace"] = "}";
    Symbol["openParenths"] = "(";
    Symbol["closeParenths"] = ")";
    Symbol["openBracket"] = "[";
    Symbol["closeBracket"] = "]";
    Symbol["period"] = ".";
    Symbol["comma"] = ",";
    Symbol["semicolon"] = ";";
    Symbol["plus"] = "+";
    Symbol["minus"] = "-";
    Symbol["asterick"] = "*";
    Symbol["slash"] = "/";
    Symbol["amperstand"] = "&";
    Symbol["pipe"] = "|";
    Symbol["lt"] = "<";
    Symbol["gt"] = ">";
    Symbol["eq"] = "=";
    Symbol["tilda"] = "~";
})(Symbol = exports.Symbol || (exports.Symbol = {}));
exports.Symbols = [
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
];
exports.Operators = [
    Symbol.plus,
    Symbol.minus,
    Symbol.asterick,
    Symbol.slash,
    Symbol.amperstand,
    Symbol.pipe,
    Symbol.lt,
    Symbol.gt,
];
exports.ExpressionTerminators = [
    Symbol.semicolon,
    Symbol.closeParenths,
    Symbol.closeBracket
];
var SymbolKind;
(function (SymbolKind) {
    SymbolKind["static"] = "STATIC";
    SymbolKind["field"] = "FIELD";
    SymbolKind["arg"] = "ARG";
    SymbolKind["var"] = "VAR";
})(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
var SymbolType;
(function (SymbolType) {
    SymbolType["array"] = "Array";
})(SymbolType = exports.SymbolType || (exports.SymbolType = {}));
var Segment;
(function (Segment) {
    Segment["const"] = "constant";
    Segment["arg"] = "argument";
    Segment["local"] = "local";
    Segment["static"] = "static";
    Segment["this"] = "this";
    Segment["that"] = "that";
    Segment["pointer"] = "pointer";
    Segment["temp"] = "temp";
})(Segment = exports.Segment || (exports.Segment = {}));
var Command;
(function (Command) {
    Command["add"] = "ADD";
    Command["sub"] = "SUB";
    Command["neg"] = "NEG";
    Command["eq"] = "EQ";
    Command["gt"] = "GT";
    Command["lt"] = "LT";
    Command["and"] = "AND";
    Command["or"] = "OR";
    Command["not"] = "NOT";
})(Command = exports.Command || (exports.Command = {}));
exports.SymbolKindSegmentMap = new Map([
    [SymbolKind.static, Segment.static],
    [SymbolKind.field, Segment.this],
    [SymbolKind.arg, Segment.arg],
    [SymbolKind.var, Segment.local],
]);
exports.Labels = {
    ifTrue: "IF_TRUE",
    ifFalse: "IF_FALSE",
    ifEnd: "IF_END",
    whileStart: "WHILE_BLOCK",
    whileEnd: "WHILE_END",
};
var Methods;
(function (Methods) {
    Methods["new"] = "new";
})(Methods = exports.Methods || (exports.Methods = {}));
exports.OsClasses = [
    "Keyboard",
    "Memory",
    "Output",
    "Screen",
    "Sys"
];
exports.PrimitiveTypes = [
    Keyword.boolean,
    Keyword.int,
    Keyword.char
];
