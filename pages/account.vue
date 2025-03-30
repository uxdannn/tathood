<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '~/lib/supabaseClient'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { user, artistProfile, fetchUser, fetchArtistProfile, logout } = useAuth()

const artistName = ref('')
const instagramHandle = ref('')
const city = ref('')
const success = ref(false)
const error = ref(false)
const isLoading = ref(true)

onMounted(async () => {
  await fetchUser()

  if (!user.value) {
    router.push('/login')
    return
  }

  await fetchArtistProfile()
  isLoading.value = false
})

const handleSubmit = async () => {
  error.value = false
  success.value = false

  const { error: insertError } = await supabase.from('artist_profiles').insert([
    {
      user_id: user.value.id,
      name: artistName.value,
      instagram: instagramHandle.value,
      city: city.value
    }
  ])

  if (insertError) {
    console.error(insertError)
    error.value = true
  } else {
    success.value = true
    const newProfile = {
      user_id: user.value.id,
      name: artistName.value,
      instagram: instagramHandle.value,
      city: city.value
    }
    artistProfile.value = newProfile
    if (process.client) {
      localStorage.setItem('artistProfile', JSON.stringify(newProfile))
    }
  }
}
</script>

<template>
  <div>
    <h1>Profil</h1>

    <template v-if="isLoading">
      <p>Lade...</p>
    </template>

    <template v-else>
      <div v-if="artistProfile">
        <p><strong>Name:</strong> {{ artistProfile.name }}</p>
        <p>
          <strong>Instagram:</strong>
          <a :href="`https://instagram.com/${artistProfile.instagram}`" target="_blank">
            @{{ artistProfile.instagram }}
          </a>
        </p>
        <p><strong>Stadt:</strong> {{ artistProfile.city }}</p>
        <p>✅ Du hast bereits ein Artist Profil angelegt.</p>
      </div>

      <div v-else class="create-artist-profil">
        <h2>Artist Profil erstellen</h2>
        <form @submit.prevent="handleSubmit">
          <input v-model="artistName" placeholder="Name" required />
          <input v-model="instagramHandle" placeholder="Instagram Handle" required />
          <input v-model="city" placeholder="Stadt / Ort" required />
          <button type="submit">Profil speichern</button>
        </form>
        <p v-if="success">✅ Profil gespeichert!</p>
        <p v-if="error">❌ Beim Speichern ist ein Fehler passiert</p>
      </div>
    </template>

    <button @click="logout">Logout</button>
  </div>
</template>

<style scoped>
.create-artist-profil {
  background-color: green;
  padding: 20px;
}
</style>