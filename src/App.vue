

<!-- SCRIPT -->
<script setup lang="ts">
import { getCamera, getRenderer } from '../src/graphics/three-setup'
import { onMounted } from 'vue'
import * as THREE from 'three'


onMounted(() => {
  const renderer = getRenderer('#c')
  const camera = getCamera()
  camera.position.z = 2 // +z goes towards the viewer -z away from viewer

  const scene = new THREE.Scene()
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({color: 0x44aa88})
  const cube = new THREE.Mesh(geometry, material)

  scene.add(cube)

  function render(time: number) {
    time *= 0.001
    cube.rotation.x = time
    cube.rotation.y = time

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
})
</script>


<!-- VUE/HTML TEMPLATE -->
<template>
  <canvas id="c"></canvas>
</template>

<!-- STYLE -->
<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>