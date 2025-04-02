<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const email = ref('')
const password = ref('')
const error = ref(null)
const successMessage = ref(null)

const { signUp } = useAuth()

const handleSignUp = async () => {
  error.value = null
  successMessage.value = null

  const { data, error: signUpError } = await signUp(email.value, password.value)

  if (signUpError) {
    error.value = signUpError.message
  } else {
    successMessage.value = '✅ Erfolgreich registriert! Bitte bestätige deine E-Mail, bevor du dich einloggst.'
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

    <p v-if="error" style="color: red">❌ {{ error }}</p>
    <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
  </div>
</template>

<style scoped>
form {
  margin-bottom: 20px;
}
</style>