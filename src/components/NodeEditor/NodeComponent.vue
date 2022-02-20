<script setup lang="ts">
import { ref, PropType, defineProps } from "vue";
import { Engine } from "./nodes/Engine";

const props = defineProps({
  node: Object as PropType<Engine>,
});
</script>

<template>
  <div class="box" :style="{
    left: node!.x + 'px',
    top: node!.y + 'px',
  }">
    <div class="input-titles"></div>

    <div v-for="(input, i) of node?.inputs" class="inputs">
      <div v-bind:id="`node-${node?.id}-input-${input.id}`" class="input">
        <div class="input-name">{{ input.name }}({{ input.getValue() }})</div>
      </div>
    </div>
    <div class="center">{{ node?.name }}</div>
    <div v-for="(output, i) of node?.outputs" class="outputs">
      <div v-bind:id="`node-${node?.id}-output-${output.id}`" class="output">
        <div class="output-name">{{ output.name }} ({{ output.getValue() }})</div>
      </div>
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
  line-height: 20px;
}
.output {
  direction: ltr;
  display: block;
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
}
.input-name {
  margin-right: 24px;
  line-height: 20px;
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
