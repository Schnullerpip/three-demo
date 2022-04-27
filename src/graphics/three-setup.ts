import * as THREE from 'three'

/**
 * Creates a renderer for an existing canvas element
 */
export function getRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    return new THREE.WebGLRenderer({canvas})
}

/**
 * Creates a perspective camera
 */
export function getCamera(): THREE.PerspectiveCamera {
    const fov = 75 // vertical field of view
    const aspect = 2
    const near = 0.1
    const far = 5
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