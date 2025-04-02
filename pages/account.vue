<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '~/lib/supabaseClient'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { user, artistProfile, fetchUser, fetchArtistProfile, logout } = useAuth()

const isLoading = ref(true)
const artistName = ref('')
const instagramHandle = ref('')
const city = ref('')
const success = ref(false)
const error = ref(false)

onMounted(async () => {
  // 1. Wenn User über E-Mail bestätigt, Tokens auslesen
  const accessToken = route.query.access_token
  const refreshToken = route.query.refresh_token
  const type = route.query.type

  if (type === 'signup' && accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (!error) {
      console.log('✅ Session nach E-Mail-Bestätigung gesetzt')
      await fetchUser()
      await fetchArtistProfile()
      router.replace({ path: '/account' }) // URL aufräumen
    } else {
      console.error('❌ Fehler beim Setzen der Session:', error.message)
    }
  } else {
    // 2. Normaler Login-Check
    await fetchUser()

    if (!user.value) {
      router.push('/login')
      return
    }

    await fetchArtistProfile()
  }

  isLoading.value = false
})

// 3. Profil erstellen
const handleSubmit = async () => {
  error.value = false
  success.value = false

  const { error: insertError } = await supabase.from('artist_profiles').insert([
    {
      user_id: user.value.id,
      name: artistName.value,
      instagram: instagramHandle.value,
      city: city.value,
    },
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
      city: city.value,
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
      <!-- Profil vorhanden -->
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

      <!-- Noch kein Profil -->
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
  background-color: #e6ffe6;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}
input {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
  max-width: 400px;
}
button {
  padding: 10px 20px;
  cursor: pointer;
}
</style>