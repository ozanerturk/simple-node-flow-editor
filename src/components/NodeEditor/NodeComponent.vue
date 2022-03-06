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
const emit = defineEmits(['inputClicked'])
function inputClicked(e: Event, input: NodeInput) {
  emit('inputClicked', input)
}


</script>

<template>
  <div class="box">
    <div class="input-titles"></div>

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
.output-name {
  margin-left: 24px;
  margin-bottom: 20px;
  line-height: 20px;
}
.invisible {
  opacity: 0.5;
}
.output {
  position: relative;
  direction: ltr;
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
}
.output-droppable {
  position: absolute;
  left: 0px;
  top: 0px;
  direction: ltr;
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
}
.input-name {
  margin-right: 24px;
  line-height: 20px;
}
.input-draggable {
  position: absolute !important;
  left: 0px;
  top: 0px;
  direction: rtl;
  display: block;
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
}
.input {
  direction: rtl;
  display: block;
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
}
.inputs {
  justify-content: space-evenly;
  display: flex;
  flex-direction: column;
  background-color: green;
  width: 20px;
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
  width: 20px;
}
.box {
  display: flex;
  flex-direction: row;
  background-color: #304455;
  width: 200px;
  height: 200px;
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
</style>
