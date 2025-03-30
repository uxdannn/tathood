<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '~/lib/supabaseClient'

const artistProfiles = ref([])
const isLoading = ref(true)

onMounted(async () => {
  // 1. Aus dem Cache laden
  const cached = localStorage.getItem('artistProfiles')
  if (cached) {
    artistProfiles.value = JSON.parse(cached)
    isLoading.value = false
  }

  // 2. Frische Daten von Supabase holen
  const { data, error } = await supabase.from('artist_profiles').select('*')

  if (!error && data) {
    artistProfiles.value = data
    localStorage.setItem('artistProfiles', JSON.stringify(data))
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <h1>Finde tolle Tattoo Artists ✨</h1>

    <div v-if="isLoading">
      <p>Loading...</p>
    </div>

    <ul v-else>
      <li v-for="artist in artistProfiles" :key="artist.id" class="artist-card">
        <p><strong>Name:</strong> {{ artist.name }}</p>
        <p><strong>Instagram:</strong><a :href="`https://instagram.com/${artist.instagram.replace('@', '')}`" target="_blank" rel="noopener">{{ artist.instagram }}</a></p>       
        <p><strong>Stadt:</strong> {{ artist.city }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.artist-card {
  background-color: #f1f1f1;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
}
</style>
