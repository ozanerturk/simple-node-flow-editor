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

// let ex = new NodeEngine();

// let engine = new Engine();
// engine.powerInput.setValue(100);

// let beaing = new Bearing();
// let beaing2 = new Bearing();

// ex.addNewNode(engine);
// ex.addNewNode(beaing);
// ex.addNewNode(beaing2);
let text = `{ "nodes": [ { "x": -10, "y": 140, "id": "C45BC9DF-16FF-6381-BA7A-79A148106525", "name": "Engine", "inputs": [ { "id": "A2864FCF-B5CB-9547-AC94-C3F0655CD884", "name": "power", "value": 100, "hasValue": true, "nodeId": "C45BC9DF-16FF-6381-BA7A-79A148106525" } ], "outputs": [ { "id": "83A3236B-1EE3-5A0D-6436-342E59BAA28F", "name": "power", "value": 200, "hasValue": true, "nodeId": "C45BC9DF-16FF-6381-BA7A-79A148106525" } ] }, { "x": 360, "y": 190, "id": "DC9F95AF-E096-537E-3557-8EBB7E8246C8", "name": "Bearing", "inputs": [ { "id": "FB689301-3045-81C8-E550-E645F493EDAA", "name": "speed", "value": 200, "hasValue": true, "nodeId": "DC9F95AF-E096-537E-3557-8EBB7E8246C8" } ], "outputs": [ { "id": "CB644F66-AB2C-0FE7-5525-F17623D72CE3", "name": "bpfo", "value": 20, "hasValue": true, "nodeId": "DC9F95AF-E096-537E-3557-8EBB7E8246C8" }, { "id": "358F07E4-A0CF-19C3-6470-B081A7B54267", "name": "bfio", "value": 13.333333333333334, "hasValue": true, "nodeId": "DC9F95AF-E096-537E-3557-8EBB7E8246C8" } ] }, { "x": 720, "y": 100, "id": "CFE07C6E-8878-F002-A9E0-CE123525BA81", "name": "Bearing", "inputs": [ { "id": "C0DF4EC3-DD7E-4F5E-5DF5-0546A2A36E54", "name": "speed", "value": 20, "hasValue": true, "nodeId": "CFE07C6E-8878-F002-A9E0-CE123525BA81" } ], "outputs": [ { "id": "025A4D4C-70BB-C017-0157-974BFF59CB1A", "name": "bpfo", "value": 2, "hasValue": true, "nodeId": "CFE07C6E-8878-F002-A9E0-CE123525BA81" }, { "id": "16A78A36-5C6A-9732-130A-FDE5F329A7EF", "name": "bfio", "value": 1.3333333333333333, "hasValue": true, "nodeId": "CFE07C6E-8878-F002-A9E0-CE123525BA81" } ] } ], "connections": [ [ "CB644F66-AB2C-0FE7-5525-F17623D72CE3", "C0DF4EC3-DD7E-4F5E-5DF5-0546A2A36E54" ], [ "83A3236B-1EE3-5A0D-6436-342E59BAA28F", "FB689301-3045-81C8-E550-E645F493EDAA" ] ] }`
let str: string = localStorage.getItem("engine") || ""
console.log(str)
let ex = NodeEngine.parse(JSON.parse(str))
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
let initX = 0, initY = 0, firstX = 0, firstY = 0;
let steps = 0;


function dragIt(element: HTMLElement, event: MouseEvent, node: Node) {
  {
    steps++;
    node.x = initX + event.pageX - firstX;
    node.y = initY + event.pageY - firstY;
    lines.forEach(l=>{
      l.position()
    })
  }
}

function mousedown(event: MouseEvent, node: Node) {
  let element = event.target as HTMLElement;
  event.preventDefault();
  if(element.classList.contains("output-droppable")){
    return;
  }
  initX = node.x;
  initY = node.y;
  firstX = event.pageX;
  firstY = event.pageY;
  console.log(node.x, initX, firstX)


  const dragListener = function (this: any, event: MouseEvent) {
    return dragIt(element, event, node);
  }
  element.addEventListener('mousemove', dragListener, false);

  window.addEventListener('mouseup', function () {
    console.log("234")
    localStorage.setItem("engine", JSON.stringify(nodeEngine.value.serialize()))
    element.removeEventListener('mousemove', dragListener, false);
  }, false);
}


initLines()


</script>

<template>
  <div>{{ nodeEngine.serialize() }}</div>
  <button @click="execute">execute</button>
  <div style="margin-left:100px">
    <div style="position:absolute; top:10px; height:100px">
      {{ store.droppedInputId }}
      <br />
      {{ store.draggingOutputId }}
    </div>
    <div style="width:100%; height:800px;background-color:grey; position: relative;">
      <NodeComponent
        @inputClicked="inputClicked"
        @mousedown="(e) => mousedown(e, node as Node)"
        :style="{ 'position': 'absolute', 'left': node.x + 'px', 'top': node.y + 'px' }"
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
