<script setup lang="ts">
import { ref, watch } from "vue";
import { NodeEngine } from "./lib/NodeEngine";
import nodesTypes from "./nodes";
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

let nodeEngine = ref(new NodeEngine());
let selectedNode = ref<Node>();
let dialogShow = ref(false);
let lines: LeaderLine[] = [];

watch(
  () => store.draggingOutputId,
  (neww, old) => {
    nodeEngine.value.attachNode(store.draggingOutputId, store.droppedInputId);
    initLines()

  }
)

function save() {
  let data = JSON.stringify(nodeEngine.value.serialize())
  localStorage.setItem("engine", data)
  downloadToFile(data, "engine.json", "text/plain")
}

function loadFromStorage() {
  let engine = localStorage.getItem("engine")
  if (engine) {
    nodeEngine.value = NodeEngine.parse(JSON.parse(engine))
    initLines()
  }
}

function load(e: any) {
  let file = e.target.files[0]
  if (file) {
    var reader = new FileReader();

    reader.onload = function (evt: any) {
      if (evt.target.readyState != 2) return;
      if (evt.target.error) {
        alert('Error while reading file');
        return;
      }
      try {
        let j = JSON.parse(evt.target.result)
        nodeEngine.value = NodeEngine.parse(j)
        initLines()
      } catch (e) {
        alert('Error while parsing file')
      }
    };

    reader.readAsText(file, "UTF-8");
  } else {
  }
}

function addComponent(nodeType: any) {
  let newNode = new nodeType();
  nodeEngine.value.addNewNode(newNode);
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
      document.getElementById(end) as HTMLElement,
      { dash: { animation: true }, size: 2 }
    )
    lines.push(l)
  }, 1)
}

function inputClicked(input: NodeInput) {
  nodeEngine.value.detachInput(input);
  initLines()
}
function removed(node: Node) {
  nodeEngine.value.removeNode(node)
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

function container_clicked(e: Event) {
  if (e.target === e.currentTarget) {
    console.log("clicked on container")
    store.selectedNodeId = "";
  }
}
function dragIt(element: HTMLElement, event: MouseEvent, node: Node) {
  {
    steps++;
    let newX = initX + event.pageX - firstX
    let newY = initY + event.pageY - firstY
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    node.x = newX;
    node.y = newY;
    // node.x = initX + event.pageX - firstX;
    // node.y = initY + event.pageY - firstY;
    lines.forEach(l => {
      l.position()
    })
  }
}

function mousedown(event: MouseEvent, node: Node) {
  selectedNode.value = node;
  let element = event.target as HTMLElement;
  if([...(element.classList as any)].some(x=>x.startsWith("dialog"))){
    return
  }
  if (element.classList.contains("output-droppable") || element.classList.contains("dialog")) {
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
    element.removeEventListener('mousemove', dragListener, false);
  }, false);
}

const downloadToFile = (content: string, filename: string, contentType: string) => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};

initLines()


</script>

<template>
  <button @click="save">save</button>
  <button @click="loadFromStorage">loadFromStorage</button>
  <label>load</label>
  <input type="file" @change="(e) => load(e)" />
  <button @click="execute">execute</button>
  
  <div style="margin-left:10px">
    <div style="display:flex;width:100%; height:800px;background-color:grey; position: relative;">
      <div class="toolbox" style="border:1px solid black; display:flex;flex-direction: column;">
        <button
          style="margin-left:10px;margin-right:10px; margin-top:10px"
          v-for="(nodeType, index) in nodesTypes"
          :key="index"
          @click="() => addComponent(nodeType)"
        >{{ nodeType.name }}</button>
      </div>
      <div
        class="editor-container"
        style="flex:1;position:relative"
        v-on:click="(e) => { container_clicked(e) }"
      >
        <NodeComponent
          @removed="removed"
          @inputClicked="inputClicked"
          v-on:mousedown="(e) => { mousedown(e, node as Node); store.selectedNodeId = node.id; }"
          v-bind:class="{ 'selected': (store.selectedNodeId === node.id) }"
          :style="{ 'position': 'absolute', 'left': node.x + 'px', 'top': node.y + 'px' }"
          v-for="(node, index) in nodeEngine.nodes"
          :key="index"
          :node="(node as Node)"
        />
      </div>
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
.selected {
  outline: 5px solid #42b983;
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
