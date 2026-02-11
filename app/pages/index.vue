<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const d20Scene = ref<{ rollDice: () => void } | null>(null)
const heroContent = ref<HTMLElement | null>(null)
const isLoaded = ref(false)

const rollDice = () => {
  d20Scene.value?.rollDice()
}

onMounted(() => {
  // Entrance animation
  isLoaded.value = true
  
  if (heroContent.value) {
    gsap.from(heroContent.value.querySelectorAll('.animate-in'), {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.3,
    })
  }
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
    <!-- 3D Scene Background -->
    <D20Scene ref="d20Scene" class="pointer-events-auto" />
    
    <!-- Gradient overlays for depth -->
    <div class="pointer-events-none absolute inset-0 z-10">
      <!-- Top gradient -->
      <div class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0a0a0f] to-transparent" />
      <!-- Bottom gradient -->
      <div class="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
      <!-- Side vignette -->
      <div class="absolute inset-0 bg-radial-gradient" />
    </div>
    
    <!-- Hero Content -->
    <div 
      ref="heroContent"
      class="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 text-center"
    >
      <!-- Badge -->
      <div class="animate-in mb-6">
        <span class="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          AI-Powered D&D Experience
        </span>
      </div>
      
      <!-- Main Title -->
      <h1 class="animate-in mb-6 max-w-4xl">
        <span class="block bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl">
          Dungeon Master
        </span>
        <span class="mt-2 block bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-4xl font-bold tracking-wide text-transparent sm:text-5xl md:text-6xl">
          AI
        </span>
      </h1>
      
      <!-- Subtitle -->
      <p class="animate-in mb-8 max-w-2xl text-lg text-gray-400 sm:text-xl md:text-2xl">
        Your personal AI Dungeon Master that creates 
        <span class="text-amber-400">immersive adventures</span>, 
        tracks your campaign, and brings your 
        <span class="text-purple-400">fantasy world</span> to life.
      </p>
      
      <!-- CTA Buttons -->
      <div class="animate-in flex flex-col gap-4 sm:flex-row">
        <UButton
          size="xl"
          color="primary"
          variant="solid"
          class="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-lg font-semibold text-black shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/40"
        >
          <span class="relative z-10 flex items-center gap-2">
            <UIcon name="i-lucide-sparkles" class="h-5 w-5" />
            Start Your Adventure
          </span>
          <span class="absolute inset-0 -z-10 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </UButton>
        
        <UButton
          size="xl"
          color="neutral"
          variant="outline"
          class="border-gray-700 px-8 py-4 text-lg font-semibold text-gray-300 transition-all hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-white"
          @click="rollDice"
        >
          <UIcon name="i-lucide-dice-6" class="mr-2 h-5 w-5" />
          Roll the Dice
        </UButton>
      </div>
      
      <!-- Stats/Social proof -->
      <div class="animate-in mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-users" class="h-5 w-5 text-amber-500" />
          <span><strong class="text-gray-300">10K+</strong> Adventurers</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-book-open" class="h-5 w-5 text-purple-500" />
          <span><strong class="text-gray-300">50K+</strong> Campaigns</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-star" class="h-5 w-5 text-blue-500" />
          <span><strong class="text-gray-300">4.9</strong> Rating</span>
        </div>
      </div>
    </div>
    
    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 animate-bounce">
      <UIcon name="i-lucide-chevron-down" class="h-8 w-8 text-gray-500" />
    </div>
  </div>
</template>

<style scoped>
.bg-radial-gradient {
  background: radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 15, 0.5) 50%, rgba(10, 10, 15, 0.9) 100%);
}

/* Shimmer effect for title */
@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

h1 span:first-child {
  background-size: 200% auto;
  animation: shimmer 8s linear infinite;
}
</style>
