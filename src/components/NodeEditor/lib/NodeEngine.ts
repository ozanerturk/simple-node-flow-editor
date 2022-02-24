import { Node } from "./Node";
import { Connection } from "./Connection";
import { NodeInput } from "./NodeInput";
import nodesTypes from "../nodes";
import { NodeOutput } from "./NodeOutput";

function resolveType(opts: any) {
  console.log("opts", [opts.object[opts.property]])
  for (let node_type of nodesTypes) {
    if (node_type.name == opts.object[opts.property].name) {
      return node_type;
    }
  }
  return Node;
}
export class NodeEngine {



  nodes: Node[] = [];
  connections: Connection[] = [];

  addNewNode(node: Node) {
    node.onExecuted = (nodeOutput: NodeOutput) => {
      //get connections
      let connections = this.connections.filter(x => x.from.id == nodeOutput.id);
      //set connection input value and execute related node 
      connections.forEach(x => {
        x.to.setValue(nodeOutput.getValue());
        x.to.node.tryExecution();
      });
    }
    this.nodes.push(node);
  }
  execute() {
    this.nodes.forEach(x => x.tryExecution())
  }



  getInputById(id: string): NodeInput {
    return this.nodes.flatMap(x => x.inputs)
      .find(x => x.id == id) as NodeInput;
  }
  getOutputById(id: string): NodeOutput {
    return this.nodes.flatMap(x => x.outputs)
      .find(x => x.id == id) as NodeOutput;
  }
  attachNode(outputId: string, inputId: string) {
    console.log("attachNode", outputId, inputId);
    console.log(this)
    let output = this.getOutputById(outputId);
    let input = this.getInputById(inputId);
    console.log("output", output);
    console.log("input", input);
    if (output && input) {
      //remove old connection
      this.detachInput(input);
      let connection = { from: output, to: input } as Connection;
      this.connections.push(connection);
    }
  }
  detachInput(input: NodeInput) {
    let index = this.connections.findIndex(x => x.to == input);
    if (index > -1) {
      this.connections.splice(index, 1);
    }
  }

}


