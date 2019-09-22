"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSymbol = "//";
exports.spaceSymbol = " ";
exports.emptySymbol = "";
var FileSuffix;
(function (FileSuffix) {
    FileSuffix["asm"] = "asm";
})(FileSuffix = exports.FileSuffix || (exports.FileSuffix = {}));
var Command;
(function (Command) {
    Command["add"] = "add";
    Command["sub"] = "sub";
    Command["neg"] = "neg";
    Command["eq"] = "eq";
    Command["gt"] = "gt";
    Command["lt"] = "lt";
    Command["and"] = "and";
    Command["or"] = "or";
    Command["not"] = "not";
    Command["pop"] = "pop";
    Command["push"] = "push";
    Command["call"] = "call";
    Command["function"] = "function";
    Command["goto"] = "goto";
    Command["if-goto"] = "if-goto";
    Command["label"] = "label";
    Command["return"] = "return";
})(Command = exports.Command || (exports.Command = {}));
var CommandType;
(function (CommandType) {
    CommandType["arithmetic"] = "arithmetic";
    CommandType["call"] = "call";
    CommandType["function"] = "function";
    CommandType["goto"] = "goto";
    CommandType["ifgoto"] = "if-goto";
    CommandType["label"] = "label";
    CommandType["pop"] = "pop";
    CommandType["push"] = "push";
    CommandType["return"] = "return";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
exports.CommandTypeMap = {
    add: CommandType.arithmetic,
    sub: CommandType.arithmetic,
    neg: CommandType.arithmetic,
    eq: CommandType.arithmetic,
    gt: CommandType.arithmetic,
    lt: CommandType.arithmetic,
    and: CommandType.arithmetic,
    or: CommandType.arithmetic,
    not: CommandType.arithmetic,
    pop: CommandType.pop,
    push: CommandType.push,
    call: CommandType.call,
    function: CommandType.function,
    goto: CommandType.goto,
    "if-goto": CommandType.ifgoto,
    label: CommandType.label,
    return: CommandType.return
};
var MemorySegment;
(function (MemorySegment) {
    MemorySegment["argument"] = "argument";
    MemorySegment["constant"] = "constant";
    MemorySegment["local"] = "local";
    MemorySegment["pointer"] = "pointer";
    MemorySegment["static"] = "static";
    MemorySegment["temp"] = "temp";
    MemorySegment["that"] = "that";
    MemorySegment["this"] = "this";
})(MemorySegment = exports.MemorySegment || (exports.MemorySegment = {}));
exports.MemorySegmentMap = {
    argument: "ARG",
    constant: "",
    local: "LCL",
    pointer: "",
    static: "",
    temp: "TEMP",
    that: "THAT",
    this: "THIS"
};
