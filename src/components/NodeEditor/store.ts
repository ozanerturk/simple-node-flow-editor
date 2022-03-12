// store.js
import { reactive } from 'vue';
import {Node} from './lib/Node';
import { NodeInput } from "./lib/NodeInput";
import { NodeOutput } from "./lib/NodeOutput";
export const store = reactive({
    draggingOutputId:"",
    droppedInputId: "",
    selectedNodeId :""
});