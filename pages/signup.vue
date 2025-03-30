<script setup>

import { ref } from 'vue'
import { supabase } from '~/lib/supabaseClient'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const success = ref(false)

const handleSignup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    success.value = true
  }
}
</script>

<template>
  <h1>Registrieren</h1>

  <form @submit.prevent="handleSignup">
    <input type="email" v-model="email" placeholder="E-Mail" required />
    <input type="password" v-model="password" placeholder="Passwort" required />
    <button type="submit">Registrieren</button>
  </form>

  <p v-if="success">Erfolgreich registriert – bitte E-Mail bestätigen ✅</p>
  <p v-if="errorMsg" style="color: red;">{{ errorMsg }}</p>
</template>