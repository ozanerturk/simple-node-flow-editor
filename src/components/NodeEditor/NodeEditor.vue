<script setup lang="ts">
import { ref } from "vue";
import { ExecutionContext } from "./lib/ExecutionContext";
import { Engine } from "./nodes/Engine";
import NodeComponent from "./NodeComponent.vue";
import { Node } from "./lib/Node";
import Moveable from "vue3-moveable"
import LeaderLine from "vue3-leaderline";
let executionContext = ref(new ExecutionContext());

let engine = new Engine();
let engine2 = new Engine();

let lines:LeaderLine = [];

executionContext.value.addNewNode(engine);
executionContext.value.addNewNode(engine2);
executionContext.value.attachNode(engine.powerOutput, engine2.powerInput);
executionContext.value.execute();
engine.powerInput.setValue(100);
executionContext.value.execute();
initLines();

function addComponent() {
  executionContext.value.addNewNode(engine3);
  executionContext.value.attachNode(engine.powerOutput, engine3.powerInput);
  executionContext.value.execute();
}
function changeattachmentAndExecute() {
  let en = new Engine();
  let lastNode = executionContext.value.nodes[executionContext.value.nodes.length - 1];
  executionContext.value.addNewNode(en);
  executionContext.value.attachNode(lastNode.powerOutput, en.powerInput);
  executionContext.value.execute();
  console.log(executionContext.value)
  initLines();
}
function initLines() {
  lines.forEach(l => {
    l.remove()
  })
  lines = []
  for (let output of executionContext.value.nodes.flatMap(x => x.outputs).filter(o => o.attachedInputs.length)) {
    console.log("output", output)
    for (let input of output.attachedInputs) {
      let start = `node-${output.node.id}-output-${output.id}`
      let end = `node-${input.node.id}-input-${input.id}`
      console.log(start, end)
      setTimeout(() => {
        let l = new LeaderLine(
          document.getElementById(start),
          document.getElementById(end)
        )
        lines.push(l)
      }, 1)


    }
  }
}
function dragging() {
  lines.forEach(l => {
    setTimeout(() => {

      l.position()
    }, 2)
  })
}

</script>

<template>
  <div style="margin-left:100px">
    <NodeComponent
      v-draggable="{ grid: [50, 50] }"
      @move="dragging"
      class="box"
      v-for="(node, index) in executionContext.nodes"
      :key="index"
      :node="(node as Node)"
    />

    <button @click="addComponent">attach and execute</button>
    <button @click="changeattachmentAndExecute">changeattachmentAndExecute</button>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}
.target {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 150px;
  left: 100px;
  line-height: 100px;
  text-align: center;
  background: #ee8;
  color: #333;
  font-weight: bold;
  border: 1px solid #333;
  box-sizing: border-box;
}
code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
