<script setup lang="ts">
import { PropType, defineProps } from "vue";
import { NodeInput } from "./lib/NodeInput";

const props = defineProps({
  input: Object as PropType<NodeInput>,
});

</script>

<template>
  <div  v-bind:id="`node-${input?.node.id}-input-${input?.id}`" class="input">
    <div class="input-name">
      {{ input?.name }}({{ input?.getValue() }})
      <div  class="dont-drag-me-father input-draggable output-drop-target "></div>
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
