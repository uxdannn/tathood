<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '~/lib/supabaseClient'
import { useAuth } from '~/composables/useAuth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const { setUser } = useAuth()

const handleLogin = async () => {
  error.value = ''

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (loginError) {
    error.value = 'Login fehlgeschlagen'
  } else {
    await setUser()
    router.push('/account')
  }
}
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="E-Mail" required />
      <input v-model="password" type="password" placeholder="Passwort" required />
      <button type="submit">Login</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>