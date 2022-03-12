import { NodeOutput } from "./NodeOutput";
import { NodeInput } from "./NodeInput";
import generateGuid from "../util/guid";
export interface INode {
  name: String;
  inputs: NodeInput[],
  outputs: NodeOutput[],
  onExecuted: (nodeOutput: NodeOutput) => void;
}
export class Node implements INode {
  serialize(): any {
    return {
      x: this.x,
      y: this.y,
      initialX:this.x,
      initialY: this.y,
      id: this.id,
      name: this.name,
      inputs: this.inputs.map(x => x.serialize()),
      outputs: this.outputs.map(x => x.serialize()),
      parameters: this.parameters
    }
  }

  public inputs: NodeInput[] = [];
  public outputs: NodeOutput[] = [];
  public parameters: Parameter[]= [];
  public name: string;
  public x: number = 0;
  public y: number = 0;
  public id: string;

  constructor (name: string) {
    this.name = name
    this.id = generateGuid();
  }

  public setId(id: string) {
    this.id = id
  }
  //to be overridden
  public execution() {

  }
  //to be overridden
  public onExecuted(nodeOutput: NodeOutput) {

  };
  public canExecute(): boolean {
    console.log(this.inputs.length, this.inputs.map(x => x.hasValue()));
    return this.inputs.every(input => input.hasValue());
  }

  public tryExecution() {
    if (this.canExecute()) {
      this.execution();
      this.outputs.forEach(n => {
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
