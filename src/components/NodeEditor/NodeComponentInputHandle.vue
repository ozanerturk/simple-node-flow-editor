<script setup lang="ts">
import { PropType, defineProps } from "vue";
import { NodeInput } from "./lib/NodeInput";
import {store} from "./store"
const props = defineProps({
  input: Object as PropType<NodeInput>,
});

</script>

<template>
  <div  v-bind:id="`node-${input?.node.id}-input-${input?.id}`" class="input">
    <div class="input-name" v-if="input?.node.id == store.selectedNodeId">
      {{ input?.name }}({{ input?.getValue() }})
      <div  class="dont-drag-me-father input-draggable output-drop-target "></div>
    </div>
  </div>
</template>

<style scoped>
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
  margin-right: 20px;
  line-height: 10px;
}
.input-draggable {
  position: absolute !important;
  left: 0px;
  top: 0px;
  direction: rtl;
  display: block;
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: black;
}
</style>
