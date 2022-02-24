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
  attachNode(fromOutput: string, toInput: string) {
    console.log("attachNode", fromOutput, toInput);
    console.log(this)
    let output = this.getOutputById(fromOutput);
    let input = this.getInputById(toInput);
    console.log("output", output);
    console.log("input", input);
    if (output && input) {

      //is connected to itself
   
      //remove old connection
      //check if output node recursiveliy connects to itself
      if (this.isAttachmentRecursive(output, input)) {
        //re-insert removed connection
        alert("recursive connection");
        return;
      }
      this.detachInput(input);

      let connection = { from: output, to: input } as Connection;
      this.connections.push(connection);
    }
  }

  isAttachmentRecursive(from: NodeOutput, to: NodeInput) {
    let nodes: Node[] = [to.node]
    let traveler_nodes = [to.node]
    while (1) {
      //get travelers connected nodes
      let travelers_connections = this.connections
        .filter(c =>
          traveler_nodes
            .map(n => n.outputs)
            .flat()
            .map(o => o.id)
            .includes(c.from.id)
        );
      if (travelers_connections.length == 0) {
        break;
      }
      //get  travelers connected node ids
      traveler_nodes = travelers_connections.map(c => c.to.node);
      if(traveler_nodes.map(x => x.id).includes(from.node.id)){
        return true;
      }
    }

    return traveler_nodes.map(x => x.id).includes(from.node.id);
  }
  getNodeById(nodeId: string | undefined) {
    return this.nodes.find(x => x.id == nodeId);
  }
  detachInput(input: NodeInput): Connection | null {
    let index = this.connections.findIndex(x => x.to == input);
    if (index > -1) {
      return this.connections.splice(index, 1)[0];
    }
    return null;
  }

}


