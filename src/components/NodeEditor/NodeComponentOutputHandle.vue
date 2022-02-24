<script setup lang="ts">
import { Draggable } from "@braks/revue-draggable";
import { ref, PropType, defineProps, reactive } from "vue";
import { NodeOutput } from "./lib/NodeOutput";
import LeaderLine from "vue3-leaderline";
import { store } from "./store";

const props = defineProps({
  output: Object as PropType<NodeOutput>,
});

const lineStart = ref()
const lineEnd = ref()
const controlledPosition = reactive({
  x: 0,
  y: 0

})
let line: LeaderLine | null = null;
function start() {
  line = new LeaderLine(lineStart.value, lineEnd.value)
}
function onControlledDrag(e: any) {
  if (line) {
    line.position()
  }
  const { x, y } = e.data;
  controlledPosition.x = x;
  controlledPosition.y = y;
}

function stop(e: any) {
  console.log(e.event.target)
  if (line) {
    line.remove()
  }
  const { x, y } = e.data;
  controlledPosition.x = 0
  controlledPosition.y = 0
  setTimeout(() => {
    if (store.droppedInputId) {
      store.draggingOutputId = props.output!.id
    } else {
      store.draggingOutputId = ""
    }
  }, 2)
}
</script>

<template>
  <div class="hello">
    <div class="output-droppable" ref="lineStart"></div>
    <Draggable
      @move="onControlledDrag"
      :enable-transform-fix="true"
      :enable-user-select-hack="true"
      :position="controlledPosition"
      @start="start"
      @stop="stop"
    >
      <div class="output-droppable" style="opacity:0; " ref="lineEnd"></div>
    </Draggable>
    <div class="output-name">
      {{ output!.name }}
      <span v-if="output!.value.hasValue">({{ output!.getValue() }})</span>
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
  flex-direction: columns;
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
