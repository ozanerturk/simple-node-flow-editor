import generateGuid from "../util/guid";
import { Node } from "./Node";
import { Value } from "./Value";

export class NodeInput {


  public name: string;
  private required: boolean = true;
  private default: any;
  private value: Value = new Value(null);
  public node: Node;
  public readonly id: string;


  constructor (node: Node, name: string) {
    this.node = node;
    this.name = name;
    this.id = generateGuid();
  }

  hasValue() {
    return this.value.hasValue;
  }
  setValue(value: any) {
    this.value.setValue(value);
  }
  getValue() {
    return this.value.value;
  }
  clearValue() {
    this.value.clear();
  }
}
