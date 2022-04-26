import * as THREE from 'three'

export function getRenderer(canvasId: String): THREE.WebGLRenderer {
    const queriedElement = document.querySelector('#c')
    if(!queriedElement) {
        throw new Error('three-setup.ts::Could NOT find canvas!')
    }
    const canvas = queriedElement as HTMLCanvasElement
    return new THREE.WebGLRenderer({canvas})
}