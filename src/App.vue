

<!-- SCRIPT -->
<script setup lang="ts">
import { createOnResizeHandler, getCamera, getComposer, getLight, getRenderer, isWebglSupported } from '../src/graphics/three-setup'
import { onMounted } from 'vue'
import * as THREE from 'three'
import { PlaneGeometry } from 'three'
import wbBannerImg from "../src/assets/wb-banner.jpeg"
import { DrawableTexture } from './utils/DrawableTexture'
//import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'

const drawableTexture = new DrawableTexture()


onMounted(async () => {


  const canvas = document.querySelector('#c') as HTMLCanvasElement

  if(!canvas) {
    throw new Error('Could NOT find canvas!')
  }

  if(!isWebglSupported()) {
    throw new Error("WebGL not supported! :(")
  }

  const [vertexShader, fragmentShader] = await Promise.all([
    await (await fetch('src/graphics/shaders/vertex.glsl')).text(),
    await (await fetch('src/graphics/shaders/waterDisplacementFragment.glsl')).text(),
  ])

  const camera = getCamera()
  const light = getLight()
  const scene = new THREE.Scene()

  const renderer = getRenderer(canvas)
  const composer = getComposer(renderer, camera, scene)
  renderer.setClearColor(0x338877)

  const onResize = createOnResizeHandler(camera, composer)
  window.onresize = onResize
  onResize()

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uTexture: {value: new THREE.TextureLoader().load(wbBannerImg)},
      uDisplacementTexture: {value: drawableTexture.texture}
    },
  })

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial())
  const plane = new THREE.Mesh(new PlaneGeometry(8, 8*0.5625, 64, 64), material)

  // example post-processing pass
  //composer.addPass(new FilmPass(0.35,0.025,648,1))

  light.position.set(0, 0, 4)
  camera.position.z = 5 // +z goes towards the viewer -z away from viewer
  cube.translateX(-4)
  plane.translateX(2)
  plane.rotateY(-0.14 * Math.PI)

  scene.add(cube)
  scene.add(light)
  scene.add(plane)

  let then = 0
  function render(now: number) {
    drawableTexture.update()
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


let lastPointAddTime = 0
window.addEventListener('mousemove', (mouseEvent: MouseEvent) => {
  const now = Date.now()
  if(now - lastPointAddTime > 15) {
    lastPointAddTime = now
    const point = {
      x: mouseEvent.clientX/window.innerWidth,
      y: mouseEvent.clientY/window.innerHeight,
    }
    drawableTexture.addPoint(point)
  }
}, {
  passive: true
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