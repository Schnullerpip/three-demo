

<!-- SCRIPT -->
<script setup lang="ts">
import { getCamera, getComposer, getLight, getRenderer } from '../src/graphics/three-setup'
import { onMounted } from 'vue'
import * as THREE from 'three'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'


onMounted(() => {

  const canvas = document.querySelector('#c') as HTMLCanvasElement

  if(!canvas) {
        throw new Error('Could NOT find canvas!')
  }

  const camera = getCamera()
  const light = getLight()
  const scene = new THREE.Scene()

  const renderer = getRenderer(canvas)
  const composer = getComposer(renderer, camera, scene)

  const cube = (() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88})
    return new THREE.Mesh(geometry, material)
  })()

  // example post-processing pass
  //composer.addPass(new FilmPass(0.35,0.025,648,1))

  light.position.set(-1, 2, 4)
  camera.position.z = 2 // +z goes towards the viewer -z away from viewer

  scene.add(cube)
  scene.add(light)

  const onResize = createOnResizeHandler(camera, composer)
  window.onresize = onResize
  onResize()

  let then = 0
  function render(now: number) {
    now *= 0.001
    const deltaTime = now - then
    then = now

    cube.rotation.x = now
    cube.rotation.y = now

    composer.render(deltaTime)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
})

const createOnResizeHandler = ((camera: THREE.PerspectiveCamera, composer: ReturnType<typeof getComposer>) => {
    const canvas = composer.renderer.domElement
    const pixelRatio = window.devicePixelRatio
  return () => {
    const width = canvas.clientWidth * pixelRatio | 0
    const height = canvas.clientHeight * pixelRatio | 0
    if(width != canvas.width || height !== canvas.height) {
      composer.setSize(width, height)
      composer.renderer.setSize(width, height, false)
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