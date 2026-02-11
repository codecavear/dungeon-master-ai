<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { TresCanvas } from '@tresjs/core'
import * as THREE from 'three'
import gsap from 'gsap'

// Refs for 3D objects
const d20Ref = ref<THREE.Mesh | null>(null)
const particlesRef = ref<THREE.Points | null>(null)
const glowRef = ref<THREE.Mesh | null>(null)
const isHovered = ref(false)
const isRolling = ref(false)

// Mouse position for parallax
const mouseX = ref(0)
const mouseY = ref(0)

// Animation time tracker
let time = 0

// Create D20 geometry - icosahedron is the base for a d20
const d20Geometry = new THREE.IcosahedronGeometry(2, 0)
const glowGeometry = new THREE.IcosahedronGeometry(2, 0)

// Create particle system
const createParticleGeometry = () => {
  const count = 500
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  
  // Gold, purple, blue colors
  const colorPalette = [
    new THREE.Color('#ffd700'), // gold
    new THREE.Color('#9b59b6'), // purple  
    new THREE.Color('#3498db'), // blue
    new THREE.Color('#e74c3c'), // red accent
  ]
  
  for (let i = 0; i < count; i++) {
    // Spread particles in a sphere around the d20
    const radius = 5 + Math.random() * 10
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
    
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }
  
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  
  return geometry
}

const particleGeometry = createParticleGeometry()

// Handle mouse move for parallax
const handleMouseMove = (event: MouseEvent) => {
  mouseX.value = (event.clientX / window.innerWidth - 0.5) * 2
  mouseY.value = (event.clientY / window.innerHeight - 0.5) * 2
}

// Roll the dice animation
const rollDice = () => {
  if (isRolling.value || !d20Ref.value) return
  isRolling.value = true
  
  const dice = d20Ref.value
  
  // Random rotations
  const rotations = {
    x: Math.random() * Math.PI * 4 + Math.PI * 2,
    y: Math.random() * Math.PI * 4 + Math.PI * 2,
    z: Math.random() * Math.PI * 4 + Math.PI * 2,
  }
  
  gsap.to(dice.rotation, {
    x: `+=${rotations.x}`,
    y: `+=${rotations.y}`,
    z: `+=${rotations.z}`,
    duration: 2,
    ease: 'power2.out',
    onComplete: () => {
      isRolling.value = false
    }
  })
  
  // Bounce effect
  gsap.to(dice.position, {
    y: 1,
    duration: 0.3,
    ease: 'power2.out',
    yoyo: true,
    repeat: 3,
  })
}

// Animation loop handler
const onLoop = ({ delta }: { delta: number }) => {
  time += delta
  
  if (d20Ref.value && !isRolling.value) {
    // Floating animation
    d20Ref.value.position.y = Math.sin(time * 0.8) * 0.3
    
    // Slow rotation
    d20Ref.value.rotation.y += delta * 0.2
    d20Ref.value.rotation.x += delta * 0.1
    
    // Parallax effect
    d20Ref.value.position.x = mouseX.value * 0.5
    d20Ref.value.position.z = mouseY.value * 0.3
  }
  
  // Sync glow mesh with d20
  if (glowRef.value && d20Ref.value) {
    glowRef.value.position.copy(d20Ref.value.position)
    glowRef.value.rotation.copy(d20Ref.value.rotation)
  }
  
  if (particlesRef.value) {
    particlesRef.value.rotation.y += delta * 0.05
    particlesRef.value.rotation.x += delta * 0.02
  }
}

// Click handler for the dice
const onDiceClick = () => {
  rollDice()
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})

// Expose rollDice to parent
defineExpose({ rollDice })
</script>

<template>
  <TresCanvas
    clear-color="#0a0a0f"
    :shadows="true"
    class="absolute inset-0 z-0"
    @loop="onLoop"
  >
    <!-- Camera -->
    <TresPerspectiveCamera :position="[0, 0, 8]" :fov="60" />
    
    <!-- Ambient light -->
    <TresAmbientLight :intensity="0.3" />
    
    <!-- Main light - warm gold -->
    <TresPointLight 
      :position="[5, 5, 5]" 
      :intensity="100" 
      color="#ffd700"
      :cast-shadow="true"
    />
    
    <!-- Secondary light - purple -->
    <TresPointLight 
      :position="[-5, -3, 3]" 
      :intensity="50" 
      color="#9b59b6"
    />
    
    <!-- Accent light - blue -->
    <TresPointLight 
      :position="[0, -5, -5]" 
      :intensity="30" 
      color="#3498db"
    />
    
    <!-- D20 Dice -->
    <TresMesh
      ref="d20Ref"
      :geometry="d20Geometry"
      @click="onDiceClick"
      @pointer-enter="isHovered = true"
      @pointer-leave="isHovered = false"
    >
      <TresMeshStandardMaterial
        color="#1a1a2e"
        :metalness="0.9"
        :roughness="0.1"
        :emissive="isHovered ? '#ffd700' : '#2d2d44'"
        :emissive-intensity="isHovered ? 0.5 : 0.2"
      />
    </TresMesh>
    
    <!-- Edge glow effect - slightly larger icosahedron -->
    <TresMesh ref="glowRef" :geometry="glowGeometry" :scale="[1.02, 1.02, 1.02]">
      <TresMeshBasicMaterial
        color="#ffd700"
        :transparent="true"
        :opacity="isHovered ? 0.3 : 0.1"
        :wireframe="true"
      />
    </TresMesh>
    
    <!-- Magical particles -->
    <TresPoints ref="particlesRef" :geometry="particleGeometry">
      <TresPointsMaterial
        :size="0.05"
        :vertex-colors="true"
        :transparent="true"
        :opacity="0.8"
        :size-attenuation="true"
      />
    </TresPoints>
  </TresCanvas>
</template>
