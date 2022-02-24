<script setup lang="ts">
import { ref, watch } from "vue";
import { NodeEngine } from "./lib/NodeEngine";
import { Engine } from "./nodes/Engine";
import { Bearing } from "./nodes/Bearing";
import { Node } from "./lib/Node";
import NodeComponent from "./NodeComponent.vue";
import LeaderLine from "vue3-leaderline";
import { store } from "./store";
import { NodeInput } from "./lib/NodeInput";
import { NodeOutput } from "./lib/NodeOutput";
import { Connection } from "./lib/Connection";

let ex = new NodeEngine();

let engine = new Engine();
engine.powerInput.setValue(100);

let beaing = new Bearing();

ex.addNewNode(engine);
ex.addNewNode(beaing);


let nodeEngine = ref(ex)

let lines: LeaderLine[] = [];

watch(
  () => store.draggingOutputId,
  (neww, old) => {
    nodeEngine.value.attachNode(store.draggingOutputId, store.droppedInputId);
    initLines()

  }
)
function addComponent() {
  let beaing = new Bearing();

  initLines();
}
function execute() {
  nodeEngine.value.execute();
  initLines();
}

function drawLines(output: NodeOutput, input: NodeInput) {
  let start = `node-${output.node.id}-output-${output.id}`
  let end = `node-${input.node.id}-input-${input.id}`
  setTimeout(() => {
    let l = new LeaderLine(
      document.getElementById(start) as HTMLElement,
      document.getElementById(end) as HTMLElement
    )
    lines.push(l)
  }, 1)
}

function inputClicked(input: NodeInput) {
  nodeEngine.value.detachInput(input);
  initLines()
}

function initLines() {
  lines.forEach(l => {
    l.remove()
  })
  lines = []
  for (let conn of nodeEngine.value.connections) {
    let connection = conn as Connection;
    drawLines(connection.from, connection.to);
  }
}

function dragging(e: CustomEvent, node: Node) {
  node.x = e.detail.data.x
  node.y = e.detail.data.y
  lines.forEach(l => {
    setTimeout(() => {
      l.position()
    }, 2)
  })
}



</script>

<template>
  <button @click="execute">execute</button>
  <div style="margin-left:100px">
    <div style="position:absolute; top:10px; height:100px">
      {{ store.droppedInputId }}
      <br />
      {{ store.draggingOutputId }}
    </div>
    <div style="width:100%; height:800px;background-color:grey; position: relative;">
      <NodeComponent
        v-draggable="{ grid: [10, 10], cancel: '.dont-drag-me-father' }"
        @move="(e: CustomEvent) => dragging(e, node as Node)"
        @inputClicked="inputClicked"
        style="position:absolute; left:0;top:0"
        v-for="(node, index) in nodeEngine.nodes"
        :key="index"
        :node="(node as Node)"
      />
    </div>
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
