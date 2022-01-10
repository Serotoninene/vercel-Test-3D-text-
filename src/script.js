import './style.css'
import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {
  FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'
import {
  TextGeometry
} from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const axesHelpers = new THREE.AxesHelper()
scene.add(axesHelpers)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
/**
 * 3D Font
 */
const fontLoader = new FontLoader()
const font = fontLoader.load(
  '/fonts/Prettywise Bold_Regular.json',
  (font) => {
    const textGeometry = new TextGeometry(
      'Hello World', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelOffset: 0,
        bevelSegments: 5,
        bevelSize: 0.02
      }
    )

    textGeometry.center()

    const textMaterial = new THREE.MeshNormalMaterial()
    // textMaterial.matcap = matcapTexture
    const text3D = new THREE.Mesh(
      textGeometry,
      textMaterial
    )
    scene.add(text3D)
    console.time("torus")
    // Adding 100 torus geometries around the text  
    const torusGeometry = new THREE.TorusGeometry()
    // const torusMaterial = new THREE.MeshMatcapMaterial({
    //   matcap: matcapTexture
    // })

    const torusMaterial = new THREE.MeshNormalMaterial()

    for (let i = 0; i < 50; i++) {
      const torus = new THREE.Mesh(torusGeometry, torusMaterial)
      torus.position.x = (Math.random() - 0.5) * 10;
      torus.position.y = (Math.random() - 0.5) * 10;
      torus.position.z = (Math.random() - 0.5) * 10;

      torus.rotateX(Math.random() * Math.PI)
      torus.rotateY(Math.random() * Math.PI)

      const randomScale = Math.random()
      torus.scale.set(randomScale, randomScale, randomScale)

      scene.add(torus)
    }
    console.timeEnd("torus")
  }
)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()