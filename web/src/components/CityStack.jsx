import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const COLORS = ['#33ccff', '#ff4d7a', '#4dff88', '#ffcc33', '#cc66ff', '#ff884d']
const BLOCK_HEIGHT = 1
const BASE_WIDTH = 5

const createBlock = ({ y, color, isGhost = false }) => {
  const geometry = new THREE.BoxGeometry(BASE_WIDTH, BLOCK_HEIGHT, BASE_WIDTH)
  const material = new THREE.MeshStandardMaterial({
    color,
    transparent: isGhost,
    opacity: isGhost ? 0.15 : 1,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0, y, 0)
  return mesh
}

export default function CityStack({ floorCount = 0, totalFloors = 25 }) {
  const mountRef = useRef(null)
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    blocks: [],
    ghosts: [],
    raf: 0,
  })

  useEffect(() => {
    const state = stateRef.current
    if (!state.scene) return

    state.blocks.forEach((block) => state.scene.remove(block))
    state.blocks = []

    for (let i = 0; i < floorCount; i++) {
      const y = i * BLOCK_HEIGHT + BLOCK_HEIGHT / 2
      const color = COLORS[i % COLORS.length]
      const block = createBlock({ y, color })
      state.scene.add(block)
      state.blocks.push(block)
    }
  }, [floorCount])

  useEffect(() => {
    const mount = mountRef.current
    const state = stateRef.current
    if (!mount) return

    state.scene = new THREE.Scene()
    state.scene.background = null

    state.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
    const midHeight = (totalFloors * BLOCK_HEIGHT) / 2
    state.camera.position.set(7, midHeight + 2, 12 + totalFloors / 5)
    state.camera.lookAt(0, midHeight, 0)

    state.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    state.renderer.shadowMap.enabled = true
    mount.appendChild(state.renderer.domElement)

    const ambient = new THREE.AmbientLight('#ffffff', 0.7)
    state.scene.add(ambient)

    const keyLight = new THREE.DirectionalLight('#ffffff', 0.8)
    keyLight.position.set(10, 15, 6)
    state.scene.add(keyLight)

    state.ghosts.forEach((block) => state.scene.remove(block))
    state.ghosts = []
    for (let i = 0; i < totalFloors; i++) {
      const y = i * BLOCK_HEIGHT + BLOCK_HEIGHT / 2
      const ghost = createBlock({ y, color: '#ffffff', isGhost: true })
      state.scene.add(ghost)
      state.ghosts.push(ghost)
    }

    const resize = () => {
      if (!mount) return
      const { clientWidth, clientHeight } = mount
      if (!clientWidth || !clientHeight) return
      state.renderer.setSize(clientWidth, clientHeight, false)
      state.camera.aspect = clientWidth / clientHeight
      state.camera.updateProjectionMatrix()
    }

    const tick = () => {
      if (state.renderer) {
        state.renderer.render(state.scene, state.camera)
      }
      state.raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    state.raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(state.raf)
      window.removeEventListener('resize', resize)
      if (state.scene) {
        state.scene.traverse((object) => {
          if (object.isMesh) {
            if (object.geometry) object.geometry.dispose()
            if (object.material) object.material.dispose()
          }
        })
      }
      if (state.renderer?.domElement) {
        mount.removeChild(state.renderer.domElement)
      }
      state.scene = null
      state.renderer = null
      state.camera = null
    }
  }, [totalFloors])

  return <div ref={mountRef} className="absolute inset-0" />
}
