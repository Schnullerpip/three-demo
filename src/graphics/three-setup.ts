import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

/**
 * Creates a renderer for an existing canvas element
 */
export function getRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    return new THREE.WebGLRenderer({canvas, antialias: true})
}

/**
 * Creates a post-processing render pipeline
 * When using a composer you should use the composer's render function instead of the renderer's one
 * as it will use the renderer internally to create the first pass
 */
export function getComposer(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene): EffectComposer {
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    return composer
}

/**
 * Creates a perspective camera
 */
export function getCamera(): THREE.PerspectiveCamera {
    const fov = 75 // vertical field of view
    const aspect = 2
    const near = 0.1
    const far = 50
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    return camera
}

/**
 * Creates a directional light
 */
export function getLight(): THREE.DirectionalLight {
    const color = 0xFFFFFF
    const intensity = 1
    return new THREE.DirectionalLight(color, intensity)
}


/**
 * Creates a callable function that correctly configures the camera aspect & the render-pipeline.
 * The returned function should ideally be called once on startup and whenever the canvas is resized.
 */
export const createOnResizeHandler = ((camera: THREE.PerspectiveCamera, composer: ReturnType<typeof getComposer>) => {
    const canvas = composer.renderer.domElement
    const pixelRatio = window.devicePixelRatio
  return () => {
    const width = canvas.clientWidth * pixelRatio | 0
    const height = canvas.clientHeight * pixelRatio | 0
    if(width != canvas.width || height !== canvas.height) {
        composer.setSize(width, height)
        composer.renderer.setSize(width, height, false)
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
    }
  }
})