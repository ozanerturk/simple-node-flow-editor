import { Node } from "./Node";
import { Value } from "./Value";
import generateGuid from "../util/guid";

export class NodeOutput {
  name: string;
  node: Node;
  value: Value = new Value(null);
  public readonly id: string;

  constructor (node: Node, name: string, id: string | undefined = undefined) {
    this.node = node;
    this.name = name;
    this.id = id || generateGuid();
  }
  getValue() {
    return this.value.value;
  }
  setValue(value: any) {
    this.value.setValue(value);
    console.log("attached inputs notified");
  }
}
