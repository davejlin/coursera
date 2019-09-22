export const commentSymbol = "//";
export const spaceSymbol = " ";
export const emptySymbol = "";

export enum FileSuffix {
    asm = "asm"
}

export enum Command {
    add = "add",
    sub = "sub",
    neg = "neg",
    eq = "eq",
    gt = "gt",
    lt = "lt",
    and = "and",
    or = "or",
    not = "not",
    pop = "pop",
    push = "push",
    call = "call",
    function = "function",
    goto = "goto",
    "if-goto" = "if-goto",
    label = "label",
    return = "return"
}

export enum CommandType {
    arithmetic = "arithmetic",
    call = "call",
    function = "function",
    goto = "goto",
    ifgoto = "if-goto",
    label = "label",
    pop = "pop",
    push = "push",
    return = "return"
}

export const CommandTypeMap: { [key in Command]: CommandType } = {
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

export enum MemorySegment {
    argument = "argument",
    constant = "constant",
    local = "local",
    pointer = "pointer",
    static = "static",
    temp = "temp",
    that = "that",
    this = "this"
}

export const MemorySegmentMap: { [key in MemorySegment]: string } = {
    argument: "ARG",
    constant: "",
    local: "LCL",
    pointer: "",
    static: "",
    temp: "TEMP",
    that: "THAT",
    this: "THIS"
};
