

<!-- SCRIPT -->
<script setup lang="ts">
import { createOnResizeHandler, getCamera, getComposer, getLight, getRenderer } from '../src/graphics/three-setup'
import { onMounted } from 'vue'
import * as THREE from 'three'
//import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'


onMounted(async () => {

  const canvas = document.querySelector('#c') as HTMLCanvasElement

  if(!canvas) {
        throw new Error('Could NOT find canvas!')
  }

  const [vertexShader, fragmentShader] = await Promise.all([
    await (await fetch('src/graphics/shaders/vertex.glsl')).text(),
    await (await fetch('src/graphics/shaders/fragment.glsl')).text(),
  ])

  const camera = getCamera()
  const light = getLight()
  const scene = new THREE.Scene()

  const renderer = getRenderer(canvas)
  const composer = getComposer(renderer, camera, scene)

  const onResize = createOnResizeHandler(camera, composer)
  window.onresize = onResize
  onResize()

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0.0 }
    },
  })

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)

  // example post-processing pass
  //composer.addPass(new FilmPass(0.35,0.025,648,1))

  light.position.set(-1, 2, 4)
  camera.position.z = 5 // +z goes towards the viewer -z away from viewer
  cube.translateX(-4)

  scene.add(cube)
  scene.add(light)

  let then = 0
  function render(now: number) {
    now *= 0.001
    const deltaTime = now - then
    then = now

    material.uniforms.uTime.value = now
    cube.rotation.x = now * 0.08
    cube.rotation.y = now * 0.08

    composer.render(deltaTime)
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
}
</style>