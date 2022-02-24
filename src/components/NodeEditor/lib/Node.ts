import { NodeOutput } from "./NodeOutput";
import { NodeInput } from "./NodeInput";
import generateGuid from "../util/guid";
export interface INode {
  name: String;
  inputs: NodeInput[],
  outputs: NodeOutput[],
  onExecuted: () => void;
}


export abstract class Node implements INode {

  public inputs: NodeInput[] = [];
  public outputs: NodeOutput[] = [];
  public name: String;
  public x: number = 0;
  public y: number = 0;
  public id: string;

  constructor (name: String) {
    this.name = name
    this.id = generateGuid();
  }
  public onExecuted(nodeOutput:NodeOutput) {

  };

  public execution() {

  }

  public canExecute(): boolean {
    console.log(this.inputs.length, this.inputs.map(x => x.hasValue()));
    return this.inputs.every(input => input.hasValue());
  }

  public tryExecution() {
    if (this.canExecute()) {
      this.execution();
      this.outputs.forEach(n=>{
        this.onExecuted(n);
      })
    } else {
      this.notReady();
    }
  }
  public updateCoordinates(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public notReady() {
    console.log(this, "not ready");
  }
}
