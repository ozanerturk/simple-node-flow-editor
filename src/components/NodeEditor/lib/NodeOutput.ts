import { NodeInput } from "./NodeInput";
import { Node } from "./Node";
import { Value } from "./Value";
import generateGuid from "../util/guid";

export class NodeOutput {

  name: string;
  node: Node;
  value: Value = new Value(null);
  attachedInputs: NodeInput[] = [];
  public readonly id: string;
  

  constructor (node: Node, name: string) {
    this.node = node;
    this.name = name;
    this.id =generateGuid(); 
  }
  getValue() {
    return this.value.value;
  }
  setValue(value: any) {
    this.value.setValue(value);
    this.notifyAttachedInputs();
    console.log("attached inputs notified");
  }
  notifyAttachedInputs(): void {
    for (let inputs of this.attachedInputs) {
      inputs.setValue(this.value.value);
      console.log("attached input values set to ", this.value.value);
    }
  }
  detachInput(input: NodeInput) {
    this.attachedInputs.splice(this.attachedInputs.findIndex(i => i.id == input.id), 1);
  }
  attachInput(input: NodeInput) {
    this.attachedInputs.push(input);
  }

}
