// store.js
import { reactive } from 'vue';
import { NodeInput } from "./lib/NodeInput";
import { NodeOutput } from "./lib/NodeOutput";
export const store = reactive({
    draggingOutputId:"",
    droppedInputId: ""
});