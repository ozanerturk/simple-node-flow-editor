import { Node } from "../lib/Node";
import { NodeOutput } from "../lib/NodeOutput";
import { NodeInput } from "../lib/NodeInput";


export class Engine extends Node {

  powerInput = new NodeInput(this, "power");
  powerOutput = new NodeOutput(this, "power");

  constructor () {
    super("Engine");
    this.inputs.push(this.powerInput);
    this.outputs.push(this.powerOutput);
  }

  public override execution(): void {
    let v = this.powerInput.getValue() * 2;
    this.powerOutput.setValue(v);
    console.log("power output set to", v);
  }

}
