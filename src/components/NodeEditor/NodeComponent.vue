<script setup lang="ts">
import { useDraggable } from "@braks/revue-draggable";
import { ref, PropType, defineProps, defineEmits } from "vue";
import { Node } from "./lib/Node";
import NodeComponentOutputHandle from "./NodeComponentOutputHandle.vue";
import NodeComponentInputHandle from "./NodeComponentInputHandle.vue";
import { store } from "./store"
import { NodeInput } from "./lib/NodeInput";

const props = defineProps({
  node: Object as PropType<Node>,
});

function mouseEnter(e: Event, input: NodeInput) {
  store.droppedInputId = input.id;
}
function mouseLeave(e: Event) {
  store.droppedInputId = ""
  store.draggingOutputId = "";
}
const emit = defineEmits(['inputClicked', 'removed'])
function inputClicked(e: Event, input: NodeInput) {
  emit('inputClicked', input)
}

function nodeRemoveClicked(node: Node) {
  emit('removed', node)
}


let dialogShow = ref(false)


</script>

<template>
  <div class="box">
    <div style="position:absolute" v-if="dialogShow">
      <div class="dialog">
        <div class="dialog-header">
          <div class="dialog-title">{{ node!.name }}</div>
          <div class="dialog-close" @click="dialogShow = false">X</div>
        </div>
        <div class="dialog-body">
          <h3>Parameters</h3>
          <div class="dialog-parameters">
            <div v-for="(param, index) in node!.parameters">
              <div class="dialog-parameter">
                <div class="dialog-parameter-name">{{ param.key }}</div>
                <input :value="param.value" @change="(e:any) => { param.value = e.target.value }" />
              </div>
            </div>
          </div>

          <hr />
          <h3>Inputs</h3>
          <div class="dialog-inputs">
            <div v-for="input in node!.inputs" class="dialog-input">
              <div class="dialog-input-name">
                <label>{{ input.name }}</label>
                <input :value="input.value.value" @change="(e:any) => { input.setValue(e.target.value)}" />
              </div>
            </div>
          </div>
          <br />
          <hr />
          <h3>Outputs</h3>
          <div class="dialog-outputs">
            <div v-for="output in node!.outputs" class="dialog-output">
              <div class="dialog-output-name">
                <label>{{ output.name }}</label>
                ({{ output.getValue() }})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      @click="() => dialogShow = true"
      v-if="node!.id == store.selectedNodeId"
      style="position:absolute;left:0px;top:-20px;width:20px;height:20px;padding:0px"
    >S</button>
    <button
      @click="() => nodeRemoveClicked(node as Node)"
      v-if="node!.id == store.selectedNodeId"
      style="position:absolute;right:0px;top:-20px;width:20px;height:20px;padding:0px"
    >X</button>
    <div class="inputs">
      <NodeComponentInputHandle
        v-for="(input, i) of node?.inputs"
        @mouseenter="(e) => mouseEnter(e, input)"
        @mouseleave="(e) => mouseLeave(e)"
        @click="(e) => inputClicked(e, input)"
        :input="input"
      ></NodeComponentInputHandle>
    </div>
    <div class="center">{{ node?.name }}</div>
    <div class="outputs">
      <NodeComponentOutputHandle
        v-for="(output, i) of node?.outputs"
        class="dont-drag-me-father output"
        v-bind:id="`node-${node?.id}-output-${output.id}`"
        :output="output"
      ></NodeComponentOutputHandle>
    </div>
  </div>
</template>

<style scoped>
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.invisible {
  opacity: 0.5;
}
.dialog-header {
  display: flex;
  padding: 10px;
  justify-content: space-between;
  border-bottom: 1px solid black;
  margin-bottom: 10px;
}
.dialog-title {
  font-size: 20px;
}
.dialog-close {
  font-size: 20px;
  cursor: pointer;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  border: 1px solid red;
  padding: 5px;
  height: 15px;
  line-height: 15px;
  background-color: red;
  color: white;
}
.dialog {
  position: fixed;
  top: 100px;
  width: 600px;
  flex-direction: column;
  height: 600px;
  background-color: white;
  border: 1px solid black;
  display: flex;
  z-index: 999;
  left: calc(50% - 300px);
}
.output {
  position: relative;
  direction: ltr;
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: black;
}

.input {
  direction: rtl;
  display: block;
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: black;
}
.inputs {
  justify-content: space-evenly;
  display: flex;
  flex-direction: column;
  background-color: green;
  width: 10px;
}
.center {
  flex: 1;
  background-color: yellow;
}
.outputs {
  position: relative;
  justify-content: space-evenly;
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 16, 16);
  width: 10px;
}
.box {
  user-select: none;
  display: flex;
  flex-direction: row;
  background-color: #304455;
  width: 100px;
  height: 100px;
  margin: 10px;
}
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
.dialog-body {
  padding-left: 15px;
  text-align: left;
}
</style>
