import generateGuid from "../util/guid";
import { Node } from "./Node";
import { Value } from "./Value";

export class NodeInput {
  serialize(): any {
    return {
      id: this.id,
      name: this.name,
      value: this.value.value,
      hasValue: this.value.hasValue,
      nodeId: this.node.id,
    }
  }


  public name: string;
  private required: boolean = true;
  private default: any;
  public value: Value = new Value(null);
  public node: Node;
  public id: string;


  constructor (node: Node, name: string,id : string="") {
    this.node = node;
    this.name = name;
    this.id = id || generateGuid();
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
