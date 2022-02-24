import { NodeOutput } from "./NodeOutput";
import { NodeInput } from "./NodeInput";

export interface Connection {
  from: NodeOutput,
  to: NodeInput
}
