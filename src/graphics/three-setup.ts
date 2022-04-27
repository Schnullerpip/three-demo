import * as THREE from 'three'

/**
 * Creates a renderer for an existing canvas element with the given id
 */
export function getRenderer(canvasId: String): THREE.WebGLRenderer {
    const queriedElement = document.querySelector('#c')
    if(!queriedElement) {
        throw new Error('three-setup.ts::Could NOT find canvas!')
    }
    const canvas = queriedElement as HTMLCanvasElement
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