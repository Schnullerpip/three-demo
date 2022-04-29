

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

  const onResize = createOnResizeHandler(camera, renderer)

  function render(time: number) {
    time *= 0.001

    onResize()

    cube.rotation.x = time
    cube.rotation.y = time

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
})

const createOnResizeHandler = ((camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio
  return () => {
    const width = canvas.clientWidth * pixelRatio | 0
    const height = canvas.clientHeight * pixelRatio | 0
    if(width != canvas.width || height !== canvas.height) {
      renderer.setSize(width, height, false)
      cameraPerspectiveUpdate(camera, canvas)
    }
  }
})

function cameraPerspectiveUpdate(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
  camera.aspect = canvas.clientWidth / canvas.clientHeight
  camera.updateProjectionMatrix()
}
</script>


<!-- VUE/HTML TEMPLATE -->
<template>
  <canvas id="c"></canvas>
</template>

<!-- STYLE -->
<style scoped>
canvas {
  width: 100%;
}
</style>