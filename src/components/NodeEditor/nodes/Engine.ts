import { Node } from "../lib/Node";
import { NodeOutput } from "../lib/NodeOutput";
import { NodeInput } from "../lib/NodeInput";


export class Engine extends Node {

  powerInput = new NodeInput(this, "power");
  powerOutput = new NodeOutput(this, "power");

  tolerance: Parameter = {
    key: "tolerance",
    value: "0.1"
  }

  constructor () {
    super("Engine");
    this.inputs.push(this.powerInput);
    this.outputs.push(this.powerOutput);
    this.parameters.push(this.tolerance)
    //get random machine image from internet
    this.image = "https://picsum.photos/100/100/?random";
  }

  public override execution(): void {
    let v = Number(this.powerInput.getValue()) * 2 + Number(this.tolerance.value);
    this.powerOutput.setValue(v);
    console.log("power output set to", v);
  }

}
