import "reflect-metadata";
import { Container } from "inversify";
import { Assembler } from "../Assembler";
import { Code } from "../Code";
import { File } from "../File";
import { Parser } from "../Parser";
import { Processor } from "../Processor";
import { SymbolTable } from "../SymbolTable";
import { TYPES } from "./types";

/**
 * This is the IoC-container instance building the application's object graph.
 */
export class DefaultContainer {
  public instance: Container;

  /**
   * Creates and configures IOC
   */
  constructor() {
    this.instance = new Container();
    this.instance.bind<Assembler>(TYPES.Assembler).to(Assembler);
    this.instance.bind<Code>(TYPES.Code).to(Code);
    this.instance.bind<File>(TYPES.File).to(File);
    this.instance.bind<Parser>(TYPES.Parse).to(Parser);
    this.instance.bind<Processor>(TYPES.Processor).to(Processor);
    this.instance.bind<SymbolTable>(TYPES.SymbolTable).to(SymbolTable);
  }
}
