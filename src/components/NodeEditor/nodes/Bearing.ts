import { Node } from "../lib/Node";
import { NodeOutput } from "../lib/NodeOutput";
import { NodeInput } from "../lib/NodeInput";


export class Bearing extends Node {

  speedInput = new NodeInput(this, "speed");
  bpfoOutput = new NodeOutput(this, "bpfo");
  bpfiOutput = new NodeOutput(this, "bfio");

  constructor () {
    super("Bearing");
    this.inputs.push(this.speedInput);
    this.outputs.push(this.bpfoOutput);
    this.outputs.push(this.bpfiOutput);
  }

  public override execution(): void {
    let bpfo = this.speedInput.getValue() / 10;
    let bpfi = this.speedInput.getValue() / 15;

    this.bpfiOutput.setValue(bpfi);
    this.bpfoOutput.setValue(bpfo);
  }

}
