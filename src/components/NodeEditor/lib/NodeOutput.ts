import { Node } from "./Node";
import { Value } from "./Value";
import generateGuid from "../util/guid";

export class NodeOutput {
  serialize(): any {
    return{
      id: this.id,
      name: this.name,
      value: this.value.value,
      hasValue: this.value.hasValue,
      nodeId: this.node.id,
    }
  }
  name: string;
  node: Node;
  value: Value = new Value(null);
  public  id: string;

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
    console.log("attached inputs notified",value);
  }
}
