import { INode, Node } from "./Node";
import { Connection } from "./Connection";
import { NodeInput } from "./NodeInput";
import nodesTypes from "../nodes";
import { NodeOutput } from "./NodeOutput";

function resolveType(nodeJson: any) {
  for (let node_type of nodesTypes) {
    if (node_type.name == nodeJson.name) {
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
      console.log("conns", connections, "connections")
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

  serialize() {
    return {
      nodes: this.nodes.map(x => x.serialize()),
      connections: this.connections.map(x => [x.from.id, x.to.id])
    }
  }

  static parse(json: any): NodeEngine {
    let engine = new NodeEngine();
    let nodes = json.nodes.map((n: any) => {
      console.log(n.parameters[0])
      let node = new (resolveType(n))(n.name);
      node.setId(String(n.id))
      node.updateCoordinates(n.x, n.y);
      node.outputs.forEach((o, i) => {
        o.name = n.outputs[i].name
        o.id = n.outputs[i].id
        o.value.setValue(n.outputs[i].value)
      })
      node.inputs.forEach((o, i) => {
        o.name = n.inputs[i].name
        o.id = n.inputs[i].id
        o.value.setValue(n.inputs[i].value)
      })
      node.parameters.forEach((o, i) => {
        o.key = n.parameters[i].key
        o.value = n.parameters[i].value
      })
      return node;
    }) as Node[];

    let connections = json.connections.map((x: any) => {
      let [from, to] = x;
      let nodeOutput = nodes.flatMap(n => n.outputs).find(x => x.id == from);
      let nodeInput = nodes.flatMap(n => n.inputs).find(x => x.id == to);
      return { from: nodeOutput, to: nodeInput } as Connection;
    })
    nodes.forEach(b => {

      engine.addNewNode(b);
    })
    engine.connections = connections;

    return engine;
  }


  removeNode(node: Node) {
    this.nodes = this.nodes.filter(x => x.id != node.id)
    this.connections = this.connections.filter(x => x.from.node.id != node.id && x.to.node.id != node.id)
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
      if (traveler_nodes.map(x => x.id).includes(from.node.id)) {
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


