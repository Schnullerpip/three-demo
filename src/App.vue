<script setup lang="ts">
import { getRenderer } from '../src/graphics/three-setup'
import { onMounted } from 'vue'

onMounted(() => {
  const renderer = getRenderer('#c')
})
</script>

<template>
  <canvas id="c"></canvas>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
