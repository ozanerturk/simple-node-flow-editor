import { Node } from "./Node";
import { NodeOutput } from "./NodeOutput";
import { NodeInput } from "./NodeInput";


export class ExecutionContext {
  execute() {
    this.nodes.forEach(node => node.tryExecution());
  }

  nodes: Node[] = [];
  addNewNode(node: Node) {
    this.nodes.push(node);
  }

  attachNode(output: NodeOutput, input: NodeInput) {
    let alreadyAttachedOutput =
      this.nodes.flatMap(x => x.outputs)
        .find(x => x.attachedInputs.some(ai => ai.id === input.id));
    if (alreadyAttachedOutput) {
      alreadyAttachedOutput.detachInput(input);
    }
    output.attachInput(input);

  }

}
