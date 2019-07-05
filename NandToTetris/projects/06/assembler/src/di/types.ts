/**
 * Type definitions for the inversify bindings. Add types for new bindings here. These types are the primary keys that
 * inversify uses to resolve bindings at run-time. The types used in the generic functions of inversify are solely used
 * for type inference at development and compile time and have no run-time effects
 */
export const TYPES = {
  Assembler: Symbol("Assembler"),
  Code: Symbol("Code"),
  File: Symbol("File"),
  Parse: Symbol("Parse"),
  Processor: Symbol("Processor"),
  SymbolTable: Symbol("SymbolTable")
};
