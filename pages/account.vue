<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '~/lib/supabaseClient'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { logout } = useAuth() // ✅ globaler Logout

const loggedInUser = ref(null)
const existingArtistProfile = ref(null)
const isLoading = ref(true)

const artistName = ref('')
const instagramHandle = ref('')
const city = ref('')
const success = ref(false)
const error = ref(false)

onMounted(async () => {
  // ✅ Schritt 1: Schnell aus localStorage lesen
  const cached = localStorage.getItem('artistProfile')
  if (cached) {
    existingArtistProfile.value = JSON.parse(cached)
    isLoading.value = false // sofort UI anzeigen
  }

  // ✅ Schritt 2: trotzdem aus Supabase aktualisieren
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    router.push('/login')
  } else {
    loggedInUser.value = data.user

    const { data: profileData } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('user_id', loggedInUser.value.id)
      .single()

    if (profileData) {
      existingArtistProfile.value = profileData
      localStorage.setItem('artistProfile', JSON.stringify(profileData))
    }
  }

  isLoading.value = false
})

const handleSubmit = async () => {
  error.value = false
  success.value = false

  const { error: insertError } = await supabase.from('artist_profiles').insert([
    {
      user_id: loggedInUser.value.id,
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
      name: artistName.value,
      instagram: instagramHandle.value,
      city: city.value
    }

    existingArtistProfile.value = newProfile
    localStorage.setItem('artistProfile', JSON.stringify(newProfile))
  }
}
</script>

<template>
  <div>
    <h1>Profil</h1>

    <!-- UI nur anzeigen, wenn alles geladen -->
    <template v-if="!isLoading">
      <!-- Profil vorhanden -->
      <div v-if="existingArtistProfile">
        <p><strong>Name:</strong> {{ existingArtistProfile.name }}</p>
        <p><strong>Instagram:</strong> {{ existingArtistProfile.instagram }}</p>
        <p><strong>Stadt:</strong> {{ existingArtistProfile.city }}</p>
        <p>✅ Du hast bereits ein Artist Profil angelegt.</p>
      </div>

      <!-- Kein Profil vorhanden -->
      <div class="create-artist-profil" v-else>
        <h2>Artist Profil erstellen</h2>
        <form @submit.prevent="handleSubmit">
          <input v-model="artistName" placeholder="Name" required />
          <input v-model="instagramHandle" placeholder="Instagram Handle" required />
          <input v-model="city" placeholder="Stadt / Ort" required />
          <button type="submit">Profil speichern</button>
        </form>
      </div>

      <p v-if="success">✅ Profil gespeichert!</p>
      <p v-if="error">❌ Beim Speichern ist ein Fehler passiert</p>
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