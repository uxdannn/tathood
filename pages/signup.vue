<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const email = ref('')
const password = ref('')
const error = ref(null)

const router = useRouter()
const { signUp } = useAuth()

const handleSignUp = async () => {
  error.value = null

  const { error: signUpError } = await signUp(email.value, password.value)

  if (signUpError) {
    error.value = signUpError.message
  } else {
    router.push('/account')
  }
}
</script>

<template>
  <div>
    <h1>Sign-Up</h1>
    <form @submit.prevent="handleSignUp">
      <input v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Passwort" />
      <button type="submit">Registrieren</button>
    </form>
    <p v-if="error">❌ {{ error }}</p>
  </div>
</template>

<style scoped>
form {
  margin-bottom: 20px;
}
</style>