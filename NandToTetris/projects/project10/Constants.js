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
