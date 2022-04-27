

<!-- SCRIPT -->
<script setup lang="ts">
import { getCamera, getLight, getRenderer } from '../src/graphics/three-setup'
import { onMounted } from 'vue'
import * as THREE from 'three'


onMounted(() => {

  const canvas = document.querySelector('#c') as HTMLCanvasElement

  if(!canvas) {
        throw new Error('Could NOT find canvas!')
  }

  canvas.width = 1280 * 2
  canvas.height= 739 * 2

  const renderer = getRenderer(canvas)
  const camera = getCamera()
  const light = getLight()

  const cube = (() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88})
    return new THREE.Mesh(geometry, material)
  })()

  light.position.set(-1, 2, 4)
  camera.position.z = 2 // +z goes towards the viewer -z away from viewer

  const scene = new THREE.Scene()
  scene.add(cube)
  scene.add(light)

  function render(time: number) {
    time *= 0.001
    cube.rotation.x = 1/6 * Math.PI
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
  width: 100vh;
  height: 55vh;
}
</style>