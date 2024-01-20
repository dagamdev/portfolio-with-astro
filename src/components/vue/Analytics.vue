<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import EyeIcon from './icons/Eye.vue'
import HeartIcon from './icons/Heart.vue'
import HeartFilledIcon from './icons/HeartFilled.vue'
import UserIcon from './icons/User.vue'
import { SERVER_PATH } from '@/utils/constants'
import type { AnalyticsData, SocketData } from '@/types' 
  
const analytics = ref({
  views: 1,
  likes: 0,
  users: 1,
  liked: false
})

let browserID = localStorage.getItem('browserID') as string

if (!browserID) {
  browserID = crypto.randomUUID()
  localStorage.setItem('browserID', browserID)
}

const handleAnalytics = (analyticsData: AnalyticsData) => {
  analytics.value = {
    views: analyticsData.views,
    likes: analyticsData.likes,
    users: analyticsData.browsers.length,
    liked: analyticsData.browsers.some(b => b.id == browserID && b.liked)
  }
}

const socket: SocketData = io(SERVER_PATH)

socket.on('connect', () => {
  console.log('connect')
  socket.emit('addView', { browserID })

  socket.on('analytics', handleAnalytics)
})

onUnmounted(() => {
  socket.off('analytics', handleAnalytics)
})

function handleLiked() {
  if (analytics.value.liked) {
    socket.emit('removeLike', { browserID })
  } else {
    socket.emit('addLike', { browserID })
  }

  analytics.value.liked = !analytics.value.liked
}
</script>

<template>
  <ul class="flex gap-x-4">
    <li class="flex gap-x-1 items-center">
      <EyeIcon />
      <strong>{{ analytics.views }}</strong>
    </li>
    <li class="flex gap-x-1 items-center">
      <span v-if="analytics.liked" class="text-red-500">
        <HeartFilledIcon @click="handleLiked" class="cursor-pointer" />
      </span>
      <HeartIcon v-else @click="handleLiked" class="cursor-pointer" />
      <strong>{{ analytics.likes }}</strong>
    </li>
    <li class="flex gap-x-1 items-center">
      <UserIcon class="" />
      <strong>{{ analytics.users }}</strong>
    </li>
  </ul>
</template>